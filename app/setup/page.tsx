import { SetupUser } from "@/actions/billing/setUpUser";

export default async function SetupPage() {
    return await SetupUser()
}