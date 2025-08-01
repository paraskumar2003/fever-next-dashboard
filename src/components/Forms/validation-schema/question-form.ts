import * as Yup from "yup";

export const questionFormSchema = Yup.object()
  .shape({
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
    QuestionCount: Yup.number()
      .typeError("Question count must be a number")
      .required("Question count is required")
      .min(1, "There must be at least one question"),
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
            .required("Flip count is required")
            .min(1, "At least one flip allowed")
            .test(
              "flip-count-max",
              "Flip count cannot be greater than total number of questions",
              function (value) {
                const { QuestionCount } = this.parent;
                if (value != null && QuestionCount != null) {
                  return value <= QuestionCount;
                }
                return true;
              },
            ),
        otherwise: (schema) => schema.notRequired().nullable(),
      }),
    flipSet: Yup.number().when("flip_allowed", {
      is: true,
      then: (schema) =>
        schema.typeError("Flip set must be a number").required(),
      otherwise: (schema) => schema.nullable(),
    }),
    set_id: Yup.number()
      .typeError("Set ID must be a number")
      .required("Please select a set"),
    noOfQuestionInCurrentCategory: Yup.number().min(0),
    noOfQuestionInCurrentSet: Yup.number().min(0),
    noOfQuestionInFlipSet: Yup.number().min(0),
  })
  // 1. QuestionCount should not exceed noOfQuestionInCurrentCategory
  .test(
    "question-count-in-category",
    "Question count cannot exceed the available questions in this category",
    function (form) {
      const { QuestionCount, noOfQuestionInCurrentCategory } = form || {};
      if (
        noOfQuestionInCurrentCategory != null &&
        QuestionCount != null &&
        QuestionCount > noOfQuestionInCurrentCategory
      ) {
        return this.createError({
          path: "QuestionCategoryId",
          message: `Please select a category which have atleast ${QuestionCount} questions.`,
        });
      }
      return true;
    },
  )
  // 2. QuestionCount should not exceed noOfQuestionInCurrentSet
  .test(
    "question-count-in-set",
    "Question count cannot exceed the available questions in this set",
    function (form) {
      const { QuestionCount, noOfQuestionInCurrentSet } = form || {};
      if (
        noOfQuestionInCurrentSet != null &&
        QuestionCount != null &&
        QuestionCount > noOfQuestionInCurrentSet
      ) {
        console.log({ QuestionCount, noOfQuestionInCurrentSet });
        return this.createError({
          path: "set_id",
          message: `Please select a set which have atleast ${QuestionCount} questions.`,
        });
      }
      return true;
    },
  )
  // 3. If flip_allowed, flip_count should not exceed noOfQuestionInFlipSet
  .test(
    "flip-count-in-flipset",
    "Flip count cannot exceed questions available in flip set",
    function (form) {
      const { flip_allowed, flip_count, noOfQuestionInFlipSet } = form || {};
      if (
        flip_allowed === true &&
        noOfQuestionInFlipSet != null &&
        flip_count != null &&
        flip_count > noOfQuestionInFlipSet
      ) {
        return this.createError({
          path: "flip_count",
          message: "Flip count cannot exceed questions available in flip set",
        });
      }
      return true;
    },
  )
  .test(
    "flipset-overlap-in-set",
    "Sum of Flip questions and Total questions cannot exceed the set's available questions",
    function (form) {
      const {
        flipSet,
        set_id,
        noOfQuestionInFlipSet,
        QuestionCount,
        noOfQuestionInCurrentSet,
        flip_count,
      } = form || {};
      if (
        flipSet != null &&
        set_id != null &&
        flipSet === set_id &&
        noOfQuestionInFlipSet != null &&
        QuestionCount != null &&
        noOfQuestionInCurrentSet != null
      ) {
        if (flip_count)
          if (flip_count + QuestionCount > noOfQuestionInCurrentSet) {
            return this.createError({
              path: "flipSet",
              message:
                "Flip Count and Total No. of Questions cannot exceed total questions available in the set.",
            });
          }
      }
      return true;
    },
  );

export async function validateQuestionFormData(formData: any): Promise<{
  isValid: boolean;
  errors: Record<string, string>;
}> {
  try {
    console.log(formData);
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
