import * as Yup from "yup";

export const instructionFormSchema = Yup.object().shape({
  contest_id: Yup.string()
    .required("Contest ID is required")
    .matches(/^\d+$/, "Contest ID must be a valid number"),

  mega_prize_name: Yup.string()
    .required("Mega prize name is required")
    .max(100, "Mega prize name must be less than 100 characters"),

  instructions: Yup.array()
    .of(
      Yup.object().shape({
        title: Yup.string()
          .required("Instruction title is required")
          .min(3, "Instruction title must be at least 3 characters")
          .max(100, "Title must be less than 100 characters"),
        description: Yup.string()
          .optional()
          .max(1000, "Description must be less than 1000 characters"),
      }),
    )
    .min(5, "At least five instruction is required")
    .required("Instructions are required"),

  sponsor_logo: Yup.mixed()
    .test(
      "is-file",
      "Sponsor logo must be a file",
      (value) => value instanceof File,
    )
    .nullable(), // in case it's optional
});

export async function validateInstructionFormData(formData: any): Promise<{
  isValid: boolean;
  errors: Record<string, string>;
}> {
  try {
    await instructionFormSchema.validate(formData, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (err: any) {
    const errors: Record<string, string> = {};

    if (err.inner && err.inner.length) {
      err.inner.forEach((validationError: any) => {
        // For nested array errors like instructions[0].title
        const path = validationError.path;
        if (path && !errors[path]) {
          errors[path] = validationError.message;
        }
      });
    }

    return { isValid: false, errors };
  }
}
