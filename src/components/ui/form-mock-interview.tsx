import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import type { Interview } from "@/types"
import { CustomBreadCrumb } from "./custom-bread-crumb"


interface FormMockInterviewProps {
    initialData : Interview | null
}
export const FormMockInterview = ({initialData}:FormMockInterviewProps) => {
    return(
        <div className="w-full flex-col spcae-y-4">
        <CustomBreadCrumb
            breadCrumbPage={breadCrumbPage}
            breadCrumpItems={[{label:"Mock Interviews", link:"/generate"}]}
             />

        </div>
    )

}