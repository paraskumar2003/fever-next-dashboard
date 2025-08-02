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
        reward_type: Yup.string().required("Reward type is required"),
        qty: Yup.number()
          .typeError("Qty must be a number")
          .min(1, "Qty must be at least 1")
          .required("Qty is required"),
        bucks: Yup.number()
          .typeError("Bucks must be a number")
          .min(0, "Bucks must be at least 0")
          .required("Bucks are required"),
        balance_coupons: Yup.number()
          .min(0)
          .required("Balance Coupons is required"),
      }),
    )
    .min(1, "At least one winner is required")
    .required("Winners are required")
    .test(
      "reward-uniqueness",
      "Do not select the same reward more than once.",
      // This function checks for duplicate reward_id when reward_type !== FEVER_BUCKS
      (winners) => {
        if (!Array.isArray(winners)) return true;
        const seen = new Set();
        for (const win of winners) {
          if (win.reward_type !== "FEVER_BUCKS") {
            const key = win.reward_id;
            if (seen.has(key)) {
              return false;
            }
            seen.add(key);
          }
        }
        return true;
      },
    )
    .test(
      "fever-bucks-bucks-uniqueness",
      "Each FEVER_BUCKS reward must have a unique bucks value.",
      // This function checks for duplicate reward_id & bucks when reward_type is FEVER_BUCKS
      (winners) => {
        if (!Array.isArray(winners)) return true;
        const pairs = new Set();
        for (const win of winners) {
          if (win.reward_type === "FEVER_BUCKS") {
            const key = `${win.reward_id}_${win.bucks}`;
            if (pairs.has(key)) {
              return false;
            }
            pairs.add(key);
          }
        }
        return true;
      },
    )
    .test(
      "qty-balance-coupons",
      "Qty cannot exceed balance coupons for non FEVER_BUCKS rewards.",
      function (winners) {
        if (!Array.isArray(winners)) return true;
        for (const win of winners) {
          if (win.reward_type == "DIGITAL") {
            if (
              typeof win.qty === "number" &&
              typeof win.balance_coupons === "number"
            ) {
              if (win.qty > win.balance_coupons) {
                // Use Yup's context to identify which winner failed, if needed.
                return this.createError({
                  path: `winners[${winners.indexOf(win)}].qty`, // mark the specific winner's qty as invalid
                  message: "Qty cannot exceed available balance coupons",
                });
              } else {
              }
            }
          }
        }
        return true;
      },
    ),
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
