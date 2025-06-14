import * as Yup from "yup";

export const questionFormSchema = Yup.object().shape({
  game_time_level: Yup.string()
    .oneOf(["GAME", "QUESTION"], "Invalid game time level")
    .required("Game time level is required"),

  game_timer: Yup.number()
    .typeError("Game timer must be a number")
    .when("game_time_level", {
      is: "GAME",
      then: (schema) =>
        schema
          .required("Game timer is required")
          .min(10, "Minimum game timer is 10 seconds"),
      otherwise: (schema) => schema.notRequired().nullable(),
    }),

  QuestionCategoryId: Yup.number()
    .typeError("Category must be a number")
    .required("Question category is required"),

  flip_allowed: Yup.boolean(),
  flip_fee: Yup.number()
    .typeError("Flip fee must be a number")
    .min(0, "Flip fee cannot be negative")
    .when("flip_allowed", {
      is: true,
      then: (schema) => schema.required("Flip fee is required"),
      otherwise: (schema) => schema.notRequired().nullable(),
    }),

  flip_count: Yup.number()
    .typeError("Flip count must be a number")
    .when("flip_allowed", {
      is: true,
      then: (schema) =>
        schema
          .min(1, "At least one flip allowed")
          .required("Flip count is required"),
      otherwise: (schema) => schema.notRequired().nullable(),
    }),

  flipSet: Yup.number().typeError("Flip set must be a number").nullable(),
});

export async function validateQuestionFormData(formData: any): Promise<{
  isValid: boolean;
  errors: Record<string, string>;
}> {
  try {
    await questionFormSchema.validate(formData, { abortEarly: false });
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
