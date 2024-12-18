"use client"

import { Button } from '@/components/ui/button'
import { FormLabel } from '@/components/ui/form'
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from '@/components/ui/input'
import db from '@/lib/db/prisma'
import { Prisma } from '@prisma/client'
import { FC } from 'react'
import {
    Form,
    FormControl, FormField,
    FormItem, FormMessage
} from "@/components/ui/form"
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { Textarea } from '@/components/ui/textarea'
import ChatWrapper from './ChatWrapper' //Änderung 2205



interface adminPageProps {

}

const adminPage: FC<adminPageProps> = ({ }) => {

    const formSchema = z.object({
        name: z.string().min(2, { message: "Name must be at least 2 characters.", }),
        prompt: z.string().min(10, { message: "Prompt must be at least 10 characters.", }),
        description: z.string().min(2, { message: "Description must be at least 2 characters.", }),
        startScreenMessage: z.string().min(2, { message: "Start Screen Message must be at least 2 characters.", }),
        startScreenTitle: z.string().min(2, { message: "Start Screen Title must be at least 2 characters.", }),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    // Server Action
    async function addConditionToDB(formData: FormData) {
        'use server'

        console.log("TRIGEGR ACTION")

        const newCondition: Prisma.ConditionCreateInput = {
            name: formData.get('name')?.toString() ?? '',
            description: formData.get('description')?.toString() ?? '',
            prompt: formData.get('prompt')?.toString() ?? '',
            startScreenMessage: formData.get('startScreenMessage')?.toString() ?? '',
            startScreenTitle: formData.get('startScreenTitle')?.toString() ?? '',
        }


        const res = await db.condition.create({
            data: {
                ...newCondition
            }
        })
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Add New Condition</h1>
            <Form {...form}>
                <form action={addConditionToDB} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Condition Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Condition Description</FormLabel>
                                <FormControl>
                                    <Textarea {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="prompt"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Condition Prompt</FormLabel>
                                <FormControl>
                                    <Textarea {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="startScreenTitle"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Start Screen Title</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="startScreenMessage"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Start Screen Message</FormLabel>
                                <FormControl>
                                    <Textarea {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />




                    <Button type="submit">Add Condition</Button>
                </form>
            </Form>
        </div >
    );
}


// Änderung 2205
const Page = () => {
    const [selectedPersonality, setSelectedPersonality] = useState<string | null>(null);

    const selectPersonality = (personality: string) => {
        setSelectedPersonality(personality);
    };

    return (
        <div>
            {!selectedPersonality ? (
                <div id="personality-selection">
                    <button onClick={() => selectPersonality('controllingCoach ')}>Controlling Coach</button>
                    <button onClick={() => selectPersonality('competenceSupportiveCoach')}>Structure-Providing Coach</button>
                    <button onClick={() => selectPersonality('relatednessSupportiveCoach')}>Relatedness-Supportive Coach</button>
                    <button onClick={() => selectPersonality('autonomySupportiveCoach')}>Autonomy-Supportive Coach</button>
                </div>
            ) : (
                <ChatWrapper selectedPersonality={selectedPersonality} />
            )}
        </div>
    );
};
// Ende Änderung 2205

export { adminPage, Page }; // Änderung 2205