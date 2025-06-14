import { ContestFormData, Question } from "@/types";

export function buildContestFormData(
  formData: any,
  contest_id: string | null,
): FormData {
  const fd = new FormData();

  fd.append("name", formData.contest_name || "");
  fd.append("rewards", formData.reward_name || "");

  const startDateTime =
    formData.start_date && formData.start_time
      ? new Date(
          `${formData.start_date}T${formData.start_time}:00Z`,
        ).toISOString()
      : "";
  const endDateTime =
    formData.end_date && formData.end_time
      ? new Date(`${formData.end_date}T${formData.end_time}:00Z`).toISOString()
      : "";

  fd.append("startDate", startDateTime);
  fd.append("endDate", endDateTime);
  fd.append("contestType", formData.contest_type || "FREE");
  fd.append(
    "contestFee",
    formData.contest_type === "PAID" ? String(formData.contest_fee || 0) : "0",
  );
  fd.append("contestTypeName", formData.contest_type_name || "");
  fd.append("sponsored_name", formData.sponsor_name || "DEFAULT");

  // Append files with proper checking
  if (formData.sponsor_logo instanceof File) {
    fd.append(
      "sponsored_logo",
      formData.sponsor_logo,
      formData.sponsor_logo.name,
    );
  }
  if (formData.thumbnail instanceof File) {
    fd.append("thumbnail", formData.thumbnail, formData.thumbnail.name);
  }
  if (formData.contest_image instanceof File) {
    fd.append(
      "contestImage",
      formData.contest_image,
      formData.contest_image.name,
    );
  }
  fd.append("isPopular", String(formData.isPopular));
  fd.append("id", String(formData.contest_id));
  return fd;
}

export function buildInstructionFormData(
  formData: any,
  contest_id: string | null,
) {
  const fd = new FormData();

  // Iterate over instructions and append them in the required format
  if (formData.instructions && Array.isArray(formData.instructions)) {
    formData.instructions.forEach((instruction: any, index: number) => {
      fd.append(`instructions[${index}][title]`, instruction.title || "");
      fd.append(
        `instructions[${index}][description]`,
        instruction.description || "",
      );
      // Add other instruction fields if necessary, e.g.:
      // fd.append(`instructions[${index}][icon]`, instruction.icon || "");
    });
  }

  fd.append("contestId", contest_id || formData.contest_id); // Note: 'contest_id' seems to be a global variable here.
  fd.append("megaPrizeName", formData.mega_prize_name || "");
  if (formData.sponsor_logo instanceof File) {
    fd.append(
      "sponsored_logo",
      formData.sponsor_logo,
      formData.sponsor_logo.name,
    );
  }
  return fd;
}

export function buildQuestionFormData(
  formData: Partial<ContestFormData>,
  contest_id: string | null,
) {
  const fd = new FormData();
  if (formData.questions && Array.isArray(formData.questions)) {
    if (contest_id) fd.append("contestId", contest_id);

    if (formData.QuestionCategoryId)
      fd.append("questionCategoryId", String(formData.QuestionCategoryId));

    fd.append("noOfQuestions", String(formData.questions.length));
    fd.append("timerType", String(formData.game_time_level));

    if (formData.game_time_level == "GAME")
      fd.append(
        "timer",
        String(formData.questions.map((e: Question) => e.timer)),
      );

    fd.append("questionFlip", String(formData.flip_allowed));
    fd.append("flipFee", String(formData.flip_fee));

    fd.append("flipAllowed", String(formData.flip_count));
    fd.append("flipSet", JSON.stringify(formData.flip_set));
  }
  return fd;
}

export function buildQuestionJsonData(
  formData: Partial<ContestFormData>,
  contest_id: string | null,
) {
  const json: any = {};

  if (formData.questions && Array.isArray(formData.questions)) {
    if (contest_id) json.contestId = parseInt(contest_id);

    if (formData.QuestionCategoryId)
      json.questionCategoryId = formData.QuestionCategoryId;

    json.noOfQuestions = formData.questions.length;
    json.timerType = formData.game_time_level == "GAME" ? "GAME" : "QUESTIONS";

    if (formData.game_time_level === "QUESTION") {
      json.timer = formData.questions.map((e: Question) => parseInt(e.timer));
    } else {
      if (formData.game_timer) json.timer = [parseInt(formData.game_timer)];
    }

    json.questionFlip = formData.flip_allowed;
    json.flipFee = formData.flip_fee;
    json.flipAllowed = formData.flip_allowed;
    json.flipSet = formData.flipSet;
  }

  return json;
}
