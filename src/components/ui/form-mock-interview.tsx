import { z } from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"

import type { Interview } from "@/types"
import { CustomBreadCrumb } from "./custom-bread-crumb"
import {useEffect ,useState} from "react"
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { Headings } from "./headings";
import { Button } from "./button";
import { Loader, Trash2 } from "lucide-react";
import { Separator } from "./separator";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./form"
import { Input } from "./input"
import { Textarea } from "./textarea"
import { chatSession } from "@/scripts";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    serverTimestamp,
    updateDoc,
  } from "firebase/firestore";
import { db } from "@/config/firebase.config"

interface FormMockInterviewProps {  
    initialData : Interview | null
}

const formSchema = z.object({
    position: z
    .string()
    .min(1, "Position is required")
    .max(100, "Position must be 100 characters or less"),
  description: z.string().min(10, "Description is required"),
  experience: z.coerce
    .number()
    .min(0, "Experience cannot be empty or negative"),
  techStack: z.string().min(1, "Tech stack must be at least a character"),

});

type FormValues = z.input<typeof formSchema>
type FormData = z.output<typeof formSchema>
export const FormMockInterview = ({initialData}:FormMockInterviewProps) => {

    const form = useForm<FormValues, unknown, FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {}
    })


    const {isValid, isSubmitting} = form.formState;
    const [loading,setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const navigate = useNavigate();
    const {userId} = useAuth();

    const title = initialData
    ? initialData.position
    : "Create a new mock interview";

    const breadCrumpPage = initialData ? initialData?.position : "Create";
    const actions = initialData ? "Save Changes" : "Create";
    const toastMessage = initialData
    ? { title: "Updated..!", description: "Changes saved successfully..." }
    : { title: "Created..!", description: "New Mock Interview created..." };

    const cleanAiResponse = (responseText:string)=>{
        let cleanText = responseText.trim();
        cleanText = cleanText.replace(/(json|```|`)/g, "");
        const jsonArrayMatch = cleanText.match(/\[.*\]/s);
        if (jsonArrayMatch) {
            cleanText = jsonArrayMatch[0];
          } else {
            throw new Error("No JSON array found in response");
          }
      
          // Step 4: Parse the clean JSON text into an array of objects
          try {
            return JSON.parse(cleanText);
          } catch (error) {
            throw new Error("Invalid JSON format: " + (error as Error)?.message);
          }
    }


    const generateAiResponse = async(data:FormData)=>{
        const prompt = `
        You are an experienced hiring manager. Generate a JSON array of exactly 5 mock interview questions with detailed, realistic model answers.

        Use a balanced mix (do not make every question pure technical trivia or coding-only):
        - Include at least 1 question about relevant experience with the role and technologies (e.g. depth of experience with ${data?.techStack}, responsibilities from the job, or "what experience do you have with …").
        - Include at least 1 behavioral or situational question (e.g. teamwork, deadlines, learning, conflict, or "tell me about a time …").
        - The remaining questions may be technical: concepts, tradeoffs, debugging, or light design/problem-solving appropriate to roughly ${data?.experience} years of experience, grounded in ${data?.techStack}.

        Each object must have exactly these string fields: "question" and "answer".

        Job information:
        - Job position: ${data?.position}
        - Job description: ${data?.description}
        - Target experience level (years): ${data?.experience}
        - Tech stack: ${data?.techStack}

        Return ONLY a valid JSON array. No markdown, no code fences, no labels, no text before or after the array.
        `;

        const aiResult = await chatSession.sendMessage(prompt);
        const cleanedResponse = cleanAiResponse(aiResult.response.text());

        return cleanedResponse;
    }

    const handleDelete = async () => {
        if (!initialData?.id) return;
        const ok = window.confirm(
            "Delete this mock interview? This cannot be undone."
        );
        if (!ok) return;
        try {
            setDeleting(true);
            await deleteDoc(doc(db, "interviews", initialData.id));
            toast.success("Deleted", {
                description: "The interview was removed.",
            });
            navigate("/generate", { replace: true });
        } catch (error) {
            console.log(error);
            toast.error("Could not delete", {
                description: "Something went wrong. Please try again.",
            });
        } finally {
            setDeleting(false);
        }
    };

    const onSubmit = async(data:FormData)=>{
        try{
            setLoading(true);
            if(initialData){
                if(isValid){
                    const aiResult= await generateAiResponse(data);
                    await updateDoc(doc(db, "interviews", initialData?.id), {
                        questions: aiResult,
                        ...data,
                        updatedAt: serverTimestamp(),
                    });
                    toast(toastMessage.title, {description: toastMessage.description});
                }

            }else{
                if(isValid){

                    const aiResult = await generateAiResponse(data);
                    await addDoc(collection(db, "interviews"), {
                        ...data,
                        userId,
                        questions: aiResult,
                        createdAt: serverTimestamp(),
                    });
                    toast(toastMessage.title, {description: toastMessage.description});

                
                
            }
        }
        navigate("/generate",{replace:true});

        }catch(error){
            console.log(error);
            toast.error("Error..",{
                description: `Something went wrong.Please try again later`,
            });
        }finally{
            setLoading(false);
        }

    }

    useEffect(()=>{
        if(initialData){
            form.reset({

                position: initialData.position,
                description: initialData.description,
                experience: initialData.experience,
                techStack: initialData.techStack
            })
            


        }
    },[initialData,form])
    return(
        <div className="w-full flex-col space-y-4">
            <CustomBreadCrumb
                breadCrumbPage={breadCrumpPage}
                breadCrumpItems={[{label:"Mock Interviews", link:"/generate"}]}
            />
            <div className="mt-4 flex items-center justify-between w-full">
                <Headings title ={title} isSubHeading />
                {initialData && (
                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        disabled={loading || deleting}
                        onClick={handleDelete}
                        aria-label="Delete interview"
                    >
                        {deleting ? (
                            <Loader className="size-4 animate-spin text-red-500" />
                        ) : (
                            <Trash2 className="min-w-4 min-h-4 text-red-500" />
                        )}
                    </Button>
                )}
            </div>

            <Separator className="my-4" />

            <div className="my-6"> </div>

            <FormProvider {...form}> 
                <form onSubmit = {form.handleSubmit(onSubmit)} className ="w-full p-8 rounded-lg flex-col 
                
                flex items-start justify-start gap-6 shadow-md "
                >
                    <FormField
                        control ={form.control}
                        name="position"
                        render ={({field}) =>(
                            <FormItem className="w-full space-y-4">
                                <div className= "w-full flex items-center justify-between">
                                    <FormLabel> Job Role/ Job Position</FormLabel>
                                    <FormMessage className="text-sm" />
                                </div>
                                <FormControl>
                                    <Input 
                                    
                                    disabled ={loading}
                                    className="h-12"
                                        placeholder="eg:-Full Stack Developer"
                                        {...field}
                                        value={field.value || ""}
                                    />

                                </FormControl>

                            </FormItem>
                        )}
                        

                    />
                    <FormField
                        control ={form.control}
                        name="description"
                        render ={({field}) =>(
                            <FormItem className="w-full space-y-4">
                                <div className= "w-full flex items-center justify-between">
                                    <FormLabel> Job Description</FormLabel>
                                    <FormMessage className="text-sm" />
                                </div>
                                <FormControl>
                                    <Textarea 
                                    {...field}
                                    disabled ={loading}
                                    className="h-12"
                                        placeholder="eg:-describe your job role or position"
                                        value={field.value || ""}
                                        
                                    />

                                </FormControl>

                            </FormItem>
                        )}
                        

                    />
                    <FormField
                        control ={form.control}
                        name="experience"
                        render ={({field}) =>(
                            <FormItem className="w-full space-y-4">
                                <div className= "w-full flex items-center justify-between">
                                    <FormLabel> Years of Experience</FormLabel>
                                    <FormMessage className="text-sm" />
                                </div>
                                <FormControl>
                                    <Input
                                    type="number"
                                    name={field.name}
                                    ref={field.ref}
                                    onBlur={field.onBlur}
                                    onChange={(e) =>
                                      field.onChange(
                                        e.target.value === "" ? undefined : Number(e.target.value)
                                      )
                                    }
                                    value={
                                      typeof field.value === "number"
                                        ? field.value
                                        : field.value
                                          ? Number(field.value)
                                          : ""
                                    }
                                    disabled ={loading}
                                    className="h-12"
                                        placeholder="eg:- 5 years in number"
                                        
                                    />

                                </FormControl>

                            </FormItem>
                        )}
                        

                    />
                    <FormField
                        control ={form.control}
                        name="techStack"
                        render ={({field}) =>(
                            <FormItem className="w-full space-y-4">
                                <div className= "w-full flex items-center justify-between">
                                    <FormLabel> TechStack</FormLabel>
                                    <FormMessage className="text-sm" />
                                </div>
                                <FormControl>
                                    <Textarea
                                    
                                    {...field}
                                    disabled ={loading}
                                    className="h-12"
                                        placeholder="eg: React, .."
                                        value={field.value || ""}
                                        
                                    />

                                </FormControl>

                            </FormItem>
                        )}

                    />
                    <div className = "w-full flex items-center justify-end gap-6">
                        <Button type="reset" size={"sm"} variant= {"outline"}
                        disabled ={isSubmitting || loading} >Reset</Button>

                        <Button type="submit" size={"sm"} variant= {"default"}
                        disabled ={isSubmitting || loading || !isValid} >
                            {loading ? (
                                <Loader className = "text-gray-50 animate-spin" />
                            ) : (
                                actions
                            )}
                            
                            
                        </Button>
                    </div>



                </form>


            </FormProvider>

        </div>
        
    );

};