import * as Yup from "yup";

export const winnersForm = Yup.object().shape({
  contest_id: Yup.number()
    .typeError("Contest ID must be a number")
    .required("Contest ID is required"),

  winners: Yup.array()
    .of(
      Yup.object().shape({
        reward_id: Yup.number()
          .typeError("Reward ID must be a number")
          .required("Reward ID is required"),
        bucks: Yup.number()
          .typeError("Bucks must be a number")
          .min(0, "Bucks must be at least 0")
          .required("Bucks are required"),
      }),
    )
    .min(1, "At least one winner is required")
    .required("Winners are required"),
});

export async function validateWinnersForm(formData: any): Promise<{
  isValid: boolean;
  errors: Record<string, string>;
}> {
  try {
    await winnersForm.validate(formData, { abortEarly: false });
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
