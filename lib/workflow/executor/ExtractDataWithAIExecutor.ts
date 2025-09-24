import { ExecutionEnvironment } from '@/types/executor'
import { ExtractDataWithAITask } from '../task/ExtractDataWIthAI'
import { prisma } from '@/lib/prisma'
import { symmetricDecrypt } from '@/lib/encryption'
import { safeParseJson } from '@/lib/ai'
import { OpenAI } from 'openai'


export async function ExtractDataWithAIExecutor(
  environment: ExecutionEnvironment<typeof ExtractDataWithAITask>
): Promise<boolean> {
  try {
    const credentials = environment.getInput('Credentials')
    if (!credentials) {
      environment.log.error('input->credentials not defined')
    }

    const prompt = environment.getInput('Prompt')
    if (!prompt) {
      environment.log.error('input->prompt not defined')
    }

    const content = environment.getInput('Content')
    if (!content) {
      environment.log.error('input->content not defined')
    }

    const credential = await prisma.credential.findUnique({
      where: { id: credentials },
    })

    if (!credential) {
      environment.log.error('credential not found')
      return false
    }

    const plainCredentialValue = symmetricDecrypt(credential.value)
    if (!plainCredentialValue) {
      environment.log.error('Cannot decrypt credential')
      return false
    }


    const openai = new OpenAI({
      apiKey: plainCredentialValue
    })

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a webscraper helper that extracts data from HTL or text. You will be given a piece of text or HTML content as input and also the prompt with with the data to be extracted. The response should always be only the extracted data as a JSON array or object, without any additional words or explanations. Analyse the input carefully and extract data precisely based on the prompt. If no data is found, return an empty JSON array. Work only with the provided content and ensure the output is always a valid JSON array without any surrounding text. RETURN ONLY THE JSON ARRAY OR OBJECT!`,
        },
        { role: 'user', content: `Content: ${content}`},
        { role: 'user', content: `Prompt: ${prompt}` }
      ],
      temperature: 1,

    })


    environment.log.info(`Prompt tokens used: ${response.usage?.prompt_tokens}`)

    environment.log.info(
      `Completion tokens: ${response.usage?.completion_tokens}`
    )

    const result = response.choices[0]?.message?.content

    if (!result) {
        environment.log.error('No data extracted - Empty response from AI')
        return false;
    }

    const parsed = safeParseJson(result)

    if (!parsed) {
      environment.log.error('Model response was not valid JSON')
      return false
    }

    environment.setOutput('Extracted Data', JSON.stringify(parsed))

    return true
  } catch (error: any) {
    environment.log.error(error.message)
    return false
  }
}
