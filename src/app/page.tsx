import ExperimentSelector from "@/components/ExperimentSelector"
import db from "@/lib/db/prisma"

export default async function Home() {

  const conditions = await db.condition.findMany()

  return <div className="h-screen container">

    <h1 className="font-bold text-2xl">LMU Chatbot</h1>
    <p className="font-light text text-muted-foreground">AI fitness partner chatbot</p>

    <ExperimentSelector conditions={conditions} />

  </div >
}
