import * as Yup from "yup";

export const contestFormSchema = Yup.object().shape({
  contest_name: Yup.string().required("Contest name is required"),
  reward_name: Yup.string().required("Reward name is required"),
  start_date: Yup.string().required("Start date is required"),
  start_time: Yup.string().required("Start time is required"),
  end_date: Yup.string().required("End date is required"),
  end_time: Yup.string().required("End time is required"),

  contest_type: Yup.string()
    .oneOf(["FREE", "PAID"], "Invalid contest type")
    .required("Contest type is required"),

  contest_fee: Yup.number().when("contest_type", {
    is: "PAID",
    then: (schema) =>
      schema
        .typeError("Contest fee must be a number")
        .min(1, "Contest fee must be at least 1")
        .required("Contest fee is required for paid contests"),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),

  contest_type_name: Yup.string().required("Contest type name is required"),
  sponsor_name: Yup.string().required("Sponsor name is required"),

  sponsor_logo: Yup.mixed()
    .test("is-file", "Sponsor logo must be a file", (value) => {
      return value instanceof File || value === undefined;
    })
    .nullable(),

  thumbnail: Yup.mixed()
    .test("is-file", "Thumbnail must be a file", (value) => {
      return value instanceof File || value === undefined;
    })
    .nullable(),

  contest_image: Yup.mixed()
    .test("is-file", "Contest image must be a file", (value) => {
      return value instanceof File || value === undefined;
    })
    .nullable(),
});

export async function validateContestFormData(formData: any): Promise<{
  isValid: boolean;
  errors: Record<string, string>;
}> {
  try {
    await contestFormSchema.validate(formData, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (err: any) {
    const errors: Record<string, string> = {};
    if (err.inner && err.inner.length) {
      err.inner.forEach((validationError: any) => {
        if (!errors[validationError.path]) {
          errors[validationError.path] = validationError.message;
        }
      });
    }
    return { isValid: false, errors };
  }
}
