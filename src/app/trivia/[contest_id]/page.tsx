"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus, Trash2, Save, Gift, Eye } from "lucide-react";
import { useContest } from "@/context/ContestContext";
import { Instruction, PrizeCatalogue, Question } from "@/types";
import Button from "@/components/Button";
import FormSection from "@/components/FormSection";
import FormInput from "@/components/FormInput";
import FormTextarea from "@/components/FormTextarea";
import FormSelect from "@/components/FormSelect";
import ImageUpload from "@/components/ImageUpload";
import { PageLayout } from "@/components";
import { ContestServices } from "@/services";
import moment from "moment";
import { Helpers } from "@/general";

const TriviaForm: React.FC = () => {
  const { push } = useRouter();
  const { formData, updateFormData } = useContest();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  let { contest_id } = useParams();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.contest_name || formData.contest_name.length < 3) {
      newErrors.contest_name = "Contest name is required (min 3 characters)";
    }

    if (!formData.reward_name || formData.reward_name.length < 3) {
      newErrors.reward_name = "Reward name is required (min 3 characters)";
    }

    if (!formData.start_date) {
      newErrors.start_date = "Start date is required";
    }

    if (!formData.start_time) {
      newErrors.start_time = "Start time is required";
    }

    if (!formData.end_date) {
      newErrors.end_date = "End date is required";
    }

    if (!formData.end_time) {
      newErrors.end_time = "End time is required";
    }

    if (!formData.sponsor_name || formData.sponsor_name.length < 3) {
      newErrors.sponsor_name = "Sponsor name is required (min 3 characters)";
    }

    if (!formData.sponsor_logo) {
      newErrors.sponsor_logo = "Sponsor logo is required";
    }

    if (!formData.thumbnail) {
      newErrors.thumbnail = "Thumbnail is required";
    }

    if (!formData.contest_image) {
      newErrors.contest_image = "Contest image is required";
    }

    if (!formData.contest_hero_logo) {
      newErrors.contest_hero_logo = "Contest hero logo is required";
    }

    if (!formData.prize_catalogue || formData.prize_catalogue.length === 0) {
      newErrors.prize_catalogue = "At least one prize is required";
    } else {
      formData.prize_catalogue.forEach((prize, index) => {
        if (!prize.prize_name) {
          newErrors[`prize_name_${index}`] = "Prize name is required";
        }
        if (!prize.prize_type) {
          newErrors[`prize_type_${index}`] = "Prize type is required";
        }
      });
    }

    if (!formData.questions || formData.questions.length === 0) {
      newErrors.questions = "At least one question is required";
    } else {
      formData.questions.forEach((question, index) => {
        if (!question.question) {
          newErrors[`question_${index}`] = "Question text is required";
        }
        if (!question.option1) {
          newErrors[`option1_${index}`] = "Option 1 is required";
        }
        if (!question.option2) {
          newErrors[`option2_${index}`] = "Option 2 is required";
        }
        if (!question.option3) {
          newErrors[`option3_${index}`] = "Option 3 is required";
        }
        if (!question.option4) {
          newErrors[`option4_${index}`] = "Option 4 is required";
        }
        if (!question.timer) {
          newErrors[`timer_${index}`] = "Timer is required";
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      push("/preview");
    } else {
      window.scrollTo(0, 0);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);

    // ✅ Form ko reset karna using updateFormData
    updateFormData({
      contest_name: "",
      reward_name: "",
      start_date: "",
      start_time: "",
      end_date: "",
      end_time: "",
      contest_type: "FREE",
      contest_fee: 0,
      contest_type_name: "",
      sponsor_name: "",
      sponsor_logo: "",
      thumbnail: "",
      contest_image: "",
      instructions: [],
      prize_catalogue: [],
      questions: [],
    });

    push("/tambola"); // ✅ Redirect after reset
  };

  const addInstruction = () => {
    const newInstruction: Instruction = {
      title: "",
      description: "",
    };

    updateFormData({
      instructions: [...(formData.instructions || []), newInstruction],
    });
  };

  const updateInstruction = (index: number, data: Partial<Instruction>) => {
    const updatedInstructions = [...(formData.instructions || [])];
    updatedInstructions[index] = { ...updatedInstructions[index], ...data };
    updateFormData({ instructions: updatedInstructions });
  };

  const removeInstruction = (index: number) => {
    const updatedInstructions = [...(formData.instructions || [])];
    updatedInstructions.splice(index, 1);
    updateFormData({ instructions: updatedInstructions });
  };

  const addPrize = () => {
    const newPrize: PrizeCatalogue = {
      prize_name: "",
      prize_type: "fever_bucks",
      text_color: "#FFFFFF",
      gradient_color: {
        direction: "to-right",
        start: "#6366F1",
        end: "#8B5CF6",
      },
      background_color: "#1F2937",
      image: "",
      quantity: 1,
    };

    updateFormData({
      prize_catalogue: [...(formData.prize_catalogue || []), newPrize],
    });
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      correctOption: "option1",
      timer: "10000",
    };

    updateFormData({
      questions: [...(formData.questions || []), newQuestion],
    });
  };

  const updateQuestion = (index: number, data: Partial<Question>) => {
    const updatedQuestions = [...(formData.questions || [])];
    updatedQuestions[index] = { ...updatedQuestions[index], ...data };
    updateFormData({ questions: updatedQuestions });
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = [...(formData.questions || [])];
    updatedQuestions.splice(index, 1);
    updateFormData({ questions: updatedQuestions });
  };

  const handlePreview = () => {
    if (validateForm()) {
      push("/preview");
    } else {
      window.scrollTo(0, 0);
    }
  };

  const fetchContestDetails = async (contest_id: string) => {
    let { data } = await ContestServices.getContestById(contest_id);
    if (data && data.data) {
      /* --  Auto filling the form -- */
      let details = data.data;
      updateFormData({
        ...formData,
        contest_name: details.name,
        reward_name: details?.rewards?.prize,
        start_date: moment(details?.startDate).format("YYYY-MM-DD"),
        end_date: moment(details?.endDate).format("YYYY-MM-DD"),
        start_time: moment(details?.startDate).format("HH:MM"),
        end_time: moment(details?.endDate).format("HH:MM"),
        contest_type: details?.contestType as "FREE" | "PAID",
        contest_fee: details?.contestFee,
        contest_type_name: details?.contestTypeName,
        contest_variant_name: details?.contestVariantName,
        sponsor_name: details?.sponsored_name,
      });
    }
  };

  useEffect(() => {
    if (contest_id) fetchContestDetails(contest_id as string);
  }, [contest_id]);

  const handleContestSave = async () => {
    try {
      const data = await buildContestFormData(formData);
    } catch (err: any) {
      return err.message;
    }
  };

  return (
    <PageLayout>
      <div className="mx-auto max-w-4xl py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold ">Create Contest ( Trivia )</h1>
          <div className="flex gap-2">
            <Button onClick={handlePreview} variant="secondary">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button onClick={handleSubmit}>
              <Save className="mr-2 h-4 w-4" />
              Save & Continue
            </Button>
          </div>
        </div>

        {Object.keys(errors).length > 0 && (
          <div className="mb-6 rounded-md border border-red-500 bg-red-500/20 p-4">
            <h3 className="mb-2 font-semibold text-red-300">
              Please fix the following errors:
            </h3>
            <ul className="list-disc pl-5 text-red-500">
              {Object.values(errors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <FormSection title="Basic Information" onSave={handleContestSave}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormInput
                    label="Contest Name"
                    placeholder="Enter contest name"
                    value={formData.contest_name || ""}
                    onChange={(e) =>
                      updateFormData({ contest_name: e.target.value })
                    }
                    error={errors.contest_name}
                  />
                  <FormInput
                    label="Reward Name"
                    placeholder="Enter reward name"
                    value={formData.reward_name || ""}
                    onChange={(e) =>
                      updateFormData({ reward_name: e.target.value })
                    }
                    error={errors.reward_name}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <FormInput
                      label="Start Date"
                      type="date"
                      value={formData.start_date || ""}
                      onChange={(e) =>
                        updateFormData({ start_date: e.target.value })
                      }
                      error={errors.start_date}
                    />
                  </div>
                  <div>
                    <FormInput
                      label="Start Time"
                      type="time"
                      value={formData.start_time || ""}
                      onChange={(e) =>
                        updateFormData({ start_time: e.target.value })
                      }
                      error={errors.start_time}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <FormInput
                      label="End Date"
                      type="date"
                      value={formData.end_date || ""}
                      onChange={(e) =>
                        updateFormData({ end_date: e.target.value })
                      }
                      error={errors.end_date}
                    />
                  </div>
                  <div>
                    <FormInput
                      label="End Time"
                      type="time"
                      value={formData.end_time || ""}
                      onChange={(e) =>
                        updateFormData({ end_time: e.target.value })
                      }
                      error={errors.end_time}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormSelect
                    label="Contest Type"
                    options={[
                      { value: "FREE", label: "Free" },
                      { value: "PAID", label: "Paid" },
                    ]}
                    value={formData.contest_type || "FREE"}
                    onChange={(e) =>
                      updateFormData({
                        contest_type: e.target.value as "FREE" | "PAID",
                      })
                    }
                  />
                  {formData.contest_type === "PAID" && (
                    <FormInput
                      label="Contest Fee"
                      type="number"
                      min="1"
                      placeholder="Enter contest fee"
                      value={formData.contest_fee?.toString() || ""}
                      onChange={(e) =>
                        updateFormData({
                          contest_fee: parseInt(e.target.value),
                        })
                      }
                      error={errors.contest_fee}
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormInput
                    label="Contest Type Name (Optional)"
                    placeholder="E.g., Premium, Standard"
                    value={formData.contest_type_name || ""}
                    onChange={(e) =>
                      updateFormData({
                        contest_type_name: e.target.value,
                      })
                    }
                  />
                  <FormInput
                    label="Contest Variant Name (Optional)"
                    placeholder="E.g., Summer Edition"
                    value={formData.contest_variant_name || ""}
                    onChange={(e) =>
                      updateFormData({
                        contest_variant_name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <ImageUpload
                    label="Sponsor Logo"
                    value={formData.sponsor_logo || ""}
                    onChange={(base64) => {
                      console.log("Sponsor Logo Updated:", base64);
                      updateFormData({ sponsor_logo: base64 || "" });
                    }}
                    error={errors.sponsor_logo}
                  />
                  <ImageUpload
                    label="Thumbnail"
                    value={formData.thumbnail || ""}
                    onChange={(base64) => {
                      console.log("Thumbnail Updated:", base64);
                      updateFormData({ thumbnail: base64 || "" });
                    }}
                    error={errors.thumbnail}
                  />
                  <ImageUpload
                    label="Contest Image"
                    value={formData.contest_image || ""}
                    onChange={(base64) => {
                      console.log("Contest Image Updated:", base64);
                      updateFormData({ contest_image: base64 || "" });
                    }}
                    error={errors.contest_image}
                  />
                  <ImageUpload
                    label="Contest Hero Logo"
                    value={formData.contest_hero_logo || ""}
                    onChange={(base64) => {
                      console.log("Contest Hero Logo Updated:", base64);
                      updateFormData({
                        contest_hero_logo: base64 || "",
                      });
                    }}
                    error={errors.contest_hero_logo}
                  />
                </div>

                <FormInput
                  label="Sponsor Name"
                  placeholder="Enter sponsor name"
                  value={formData.sponsor_name || ""}
                  onChange={(e) =>
                    updateFormData({ sponsor_name: e.target.value })
                  }
                  error={errors.sponsor_name}
                />
              </FormSection>

              <FormSection title="Images">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <ImageUpload
                    label="Sponsor Logo"
                    value={formData.sponsor_logo || ""}
                    onChange={(base64) => {
                      console.log("Sponsor Logo Updated:", base64);
                      updateFormData({ sponsor_logo: base64 || "" });
                    }}
                    error={errors.sponsor_logo}
                  />
                  <ImageUpload
                    label="Thumbnail"
                    value={formData.thumbnail || ""}
                    onChange={(base64) => {
                      console.log("Thumbnail Updated:", base64);
                      updateFormData({ thumbnail: base64 || "" });
                    }}
                    error={errors.thumbnail}
                  />
                  <ImageUpload
                    label="Contest Image"
                    value={formData.contest_image || ""}
                    onChange={(base64) => {
                      console.log("Contest Image Updated:", base64);
                      updateFormData({ contest_image: base64 || "" });
                    }}
                    error={errors.contest_image}
                  />
                  <ImageUpload
                    label="Contest Hero Logo"
                    value={formData.contest_hero_logo || ""}
                    onChange={(base64) => {
                      console.log("Contest Hero Logo Updated:", base64);
                      updateFormData({
                        contest_hero_logo: base64 || "",
                      });
                    }}
                    error={errors.contest_hero_logo}
                  />
                </div>
              </FormSection>

              <FormSection title="Game Settings">
                <FormInput
                  label="Proceed Button Text"
                  placeholder="E.g., Proceed to Game"
                  value={formData.game_proceed?.submitBtn}
                  onChange={(e) =>
                    updateFormData({
                      game_proceed: {
                        submitBtn: e.target.value, // 🛠 Ensure submitBtn is never undefined
                        Tnc: formData.game_proceed?.Tnc || "", // Preserve existing Tnc value
                      },
                    })
                  }
                  error={errors.game_proceed_submitBtn}
                />

                <FormTextarea
                  label="Terms & Conditions (Optional)"
                  placeholder="Enter terms and conditions"
                  value={formData.game_proceed?.Tnc || ""}
                  onChange={(e) =>
                    updateFormData({
                      game_proceed: {
                        submitBtn:
                          formData.game_proceed?.submitBtn || "Proceed to Game", // 🛠 Preserve submitBtn value
                        Tnc: e.target.value,
                      },
                    })
                  }
                  rows={4}
                />
              </FormSection>

              <FormSection title="Instructions (Optional)">
                {(formData.instructions || []).map((instruction, index) => (
                  <div
                    key={index}
                    className="mb-4 rounded-md border border-white/10 bg-white/5 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-medium ">Instruction #{index + 1}</h3>
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => removeInstruction(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormInput
                      label="Title"
                      placeholder="Enter instruction title"
                      value={instruction.title || ""}
                      onChange={(e) =>
                        updateInstruction(index, { title: e.target.value })
                      }
                    />
                    <FormTextarea
                      label="Description"
                      placeholder="Enter instruction description"
                      value={instruction.description || ""}
                      onChange={(e) =>
                        updateInstruction(index, {
                          description: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="secondary"
                  onClick={addInstruction}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Instruction
                </Button>
              </FormSection>

              <FormSection title="Questions">
                {errors.questions && (
                  <div className="mb-4 rounded-md border border-red-500 bg-red-500/20 p-3">
                    <p className="text-red-300">{errors.questions}</p>
                  </div>
                )}

                {(formData.questions || []).map((question, index) => (
                  <div key={index} className="mb-4 rounded-lg bg-white/5 p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-medium ">Question {index + 1}</h3>
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => removeQuestion(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <FormTextarea
                      label="Question"
                      placeholder="Enter your question"
                      value={question.question}
                      onChange={(e) =>
                        updateQuestion(index, { question: e.target.value })
                      }
                      error={errors[`question_${index}`]}
                    />

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormInput
                        label="Option A"
                        placeholder="Enter option A"
                        value={question.option1}
                        onChange={(e) =>
                          updateQuestion(index, { option1: e.target.value })
                        }
                        error={errors[`option1_${index}`]}
                      />
                      <FormInput
                        label="Option B"
                        placeholder="Enter option B"
                        value={question.option2}
                        onChange={(e) =>
                          updateQuestion(index, { option2: e.target.value })
                        }
                        error={errors[`option2_${index}`]}
                      />
                      <FormInput
                        label="Option C"
                        placeholder="Enter option C"
                        value={question.option3}
                        onChange={(e) =>
                          updateQuestion(index, { option3: e.target.value })
                        }
                        error={errors[`option3_${index}`]}
                      />
                      <FormInput
                        label="Option D"
                        placeholder="Enter option D"
                        value={question.option4}
                        onChange={(e) =>
                          updateQuestion(index, { option4: e.target.value })
                        }
                        error={errors[`option4_${index}`]}
                      />
                    </div>

                    <FormSelect
                      label="Correct Answer"
                      options={[
                        { value: "option1", label: "Option A" },
                        { value: "option2", label: "Option B" },
                        { value: "option3", label: "Option C" },
                        { value: "option4", label: "Option D" },
                      ]}
                      value={question.correctOption}
                      onChange={(e) =>
                        updateQuestion(index, {
                          correctOption: e.target.value as
                            | "option1"
                            | "option2"
                            | "option3"
                            | "option4",
                        })
                      }
                    />

                    <FormInput
                      label="Timer In ( Milliseconds )"
                      placeholder="10000"
                      value={question.timer}
                      onChange={(e) =>
                        updateQuestion(index, { timer: e.target.value })
                      }
                      error={errors[`timer_${index}`]}
                    />
                  </div>
                ))}

                <Button
                  type="button"
                  variant="secondary"
                  onClick={addQuestion}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Question
                </Button>
              </FormSection>
            </form>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

function buildContestFormData(formData: any): FormData {
  const fd = new FormData();

  // Append text fields
  fd.append("name", formData.contest_name || "");
  fd.append("rewards", formData.reward_name || "");

  // Combine date and time to ISO format
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
  fd.append("sponsored_name", formData.sponsor_name || "");

  // Append image files (base64 to File)
  if (formData.sponsor_logo) {
    let file = Helpers.base64ToFile(formData.sponsor_logo, "sponsor_logo.png");
    if (file instanceof File) {
      fd.append("sponsored_logo", file);
    }
  }

  if (formData.thumbnail) {
    fd.append(
      "thumbnail",
      Helpers.base64ToFile(formData.thumbnail, "thumbnail.png"),
    );
  }

  if (formData.contest_image) {
    fd.append(
      "contestImage",
      Helpers.base64ToFile(formData.contest_image, "contest_image.png"),
    );
  }

  return fd;
}

export default TriviaForm;
