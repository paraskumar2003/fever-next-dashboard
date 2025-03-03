"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save, Eye } from "lucide-react";
import { useContest } from "../../context/ContestContext";
import FormSection from "../../components/FormSection";
import FormInput from "../../components/FormInput";
import FormSelect from "../../components/FormSelect";
import FormTextarea from "../../components/FormTextarea";
import Button from "../../components/Button";
import ColorPicker from "../../components/ColorPicker";
import ImageUpload from "../../components/ImageUpload";
import { PrizeCatalogue, Question, Instruction } from "../../types";
import SuccessModal from "../../components/SuccessPopup";
import { PageLayout } from "@/components";

const ContestForm: React.FC = () => {
  const { push } = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { formData, updateFormData } = useContest();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Basic validation for required fields
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

    if (
      formData.contest_type === "PAID" &&
      (!formData.contest_fee || formData.contest_fee < 1)
    ) {
      newErrors.contest_fee =
        "Contest fee is required for paid contests (min: 1)";
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

    if (!formData.game_proceed?.submitBtn) {
      newErrors.game_proceed_submitBtn = "Submit button text is required";
    }

    // Prize catalogue validation
    if (!formData.prize_catalogue || formData.prize_catalogue.length === 0) {
      newErrors.prize_catalogue = "At least one prize is required";
    } else {
      formData.prize_catalogue.forEach((prize: any, index: number) => {
        if (!prize.prize_name) {
          newErrors[`prize_name_${index}`] = "Prize name is required";
        }
        if (!prize.text_color) {
          newErrors[`text_color_${index}`] = "Text color is required";
        }
        if (!prize.background_color) {
          newErrors[`background_color_${index}`] =
            "Background color is required";
        }
        if (
          !prize.gradient_color ||
          !prize.gradient_color.start ||
          !prize.gradient_color.end ||
          !prize.gradient_color.direction
        ) {
          newErrors[`gradient_color_${index}`] =
            "Gradient color direction, start and end are required";
        }
        if (!prize.image) {
          newErrors[`image_${index}`] = "Image is required";
        }
      });
    }

    // Questions validation
    if (!formData.questions || formData.questions.length === 0) {
      newErrors.questions = "At least one question is required";
    } else {
      formData.questions.forEach((question: any, index: number) => {
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
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // ✅ User Input Se JSON Generate Karna
      const spinTheWheelJson = {
        contest_name: formData.contest_name || "",
        reward_name: formData.reward_name || "",
        start_date: formData.start_date || "",
        start_time: formData.start_time || "",
        end_date: formData.end_date || "",
        end_time: formData.end_time || "",
        contest_type: formData.contest_type || "FREE",
        contest_fee: formData.contest_fee || 0,
        contest_type_name: formData.contest_type_name || "",
        sponsor_name: formData.sponsor_name || "",
        sponsor_logo: formData.sponsor_logo || "",
        thumbnail: formData.thumbnail || "",
        contest_image: formData.contest_image || "",
        contest_hero_logo: formData.contest_hero_logo || "",
        instructions: formData.instructions || [],
        wheel_prizes: formData.prize_catalogue || [],
        questions: formData.questions || [],
      };

      // ✅ Console me JSON Print Karna
      console.log("🚀 Submitted JSON:", spinTheWheelJson);

      // ✅ Future API Call ke liye (Agar chahiye toh)
      // fetch("https://your-api-endpoint.com", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(spinTheWheelJson),
      // })
      // .then(response => response.json())
      // .then(data => console.log("API Response:", data))
      // .catch(error => console.error("API Error:", error));
      setIsModalOpen(true);
    } else {
      window.scrollTo(0, 0);
    }
  };

  // ✅ Modal Close Aur Page Redirect
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

    push("/wheel-for-fortune"); // ✅ Redirect after reset
  };

  const handlePreview = () => {
    if (validateForm()) {
      push("/preview");
    } else {
      window.scrollTo(0, 0);
    }
  };

  const addPrize = () => {
    const newPrize: PrizeCatalogue = {
      prize_name: "",
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

  const updatePrize = (index: number, data: Partial<PrizeCatalogue>) => {
    const updatedPrizes = [...(formData.prize_catalogue || [])];
    updatedPrizes[index] = { ...updatedPrizes[index], ...data };
    updateFormData({ prize_catalogue: updatedPrizes });
  };

  const removePrize = (index: number) => {
    const updatedPrizes = [...(formData.prize_catalogue || [])];
    updatedPrizes.splice(index, 1);
    updateFormData({ prize_catalogue: updatedPrizes });
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      correctOption: "option1",
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

  return (
    <PageLayout>
      <div className="mx-auto max-w-4xl py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="push text-3xl font-bold">
            Create Contest ( Wheel of Fortune )
          </h1>
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

        <form onSubmit={handleSubmit}>
          <FormSection title="Basic Information">
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
                  onChange={(e) => updateFormData({ end_date: e.target.value })}
                  error={errors.end_date}
                />
              </div>
              <div>
                <FormInput
                  label="End Time"
                  type="time"
                  value={formData.end_time || ""}
                  onChange={(e) => updateFormData({ end_time: e.target.value })}
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
                    updateFormData({ contest_fee: parseInt(e.target.value) })
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
                  updateFormData({ contest_type_name: e.target.value })
                }
              />
              <FormInput
                label="Contest Variant Name (Optional)"
                placeholder="E.g., Summer Edition"
                value={formData.contest_variant_name || ""}
                onChange={(e) =>
                  updateFormData({ contest_variant_name: e.target.value })
                }
              />
            </div>

            <FormInput
              label="Sponsor Name"
              placeholder="Enter sponsor name"
              value={formData.sponsor_name || ""}
              onChange={(e) => updateFormData({ sponsor_name: e.target.value })}
              error={errors.sponsor_name}
            />
          </FormSection>

          <FormSection title="Images">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <ImageUpload
                label="Sponsor Logo"
                value={formData.sponsor_logo || ""}
                onChange={(base64) => updateFormData({ sponsor_logo: base64 })}
                error={errors.sponsor_logo}
              />
              <ImageUpload
                label="Thumbnail"
                value={formData.thumbnail || ""}
                onChange={(base64) => updateFormData({ thumbnail: base64 })}
                error={errors.thumbnail}
              />
              <ImageUpload
                label="Contest Image"
                value={formData.contest_image || ""}
                onChange={(base64) => updateFormData({ contest_image: base64 })}
                error={errors.contest_image}
              />
              <ImageUpload
                label="Contest Hero Logo"
                value={formData.contest_hero_logo || ""}
                onChange={(base64) =>
                  updateFormData({ contest_hero_logo: base64 })
                }
                error={errors.contest_hero_logo}
              />
            </div>
          </FormSection>

          <FormSection title="Game Settings">
            <FormInput
              label="Proceed Button Text"
              placeholder="E.g., Proceed to Game"
              value={formData.game_proceed?.submitBtn || "Proceed to Game"}
              onChange={(e) =>
                updateFormData({
                  game_proceed: {
                    submitBtn: e.target.value || "Proceed to Game", // 🛠 Ensure submitBtn is never undefined
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
            {(formData.instructions || []).map(
              (instruction: any, index: number) => (
                <div
                  key={index}
                  className="mb-4 rounded-md border border-white/10 bg-white/5 p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="push font-medium">
                      Instruction #{index + 1}
                    </h3>
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
                      updateInstruction(index, { description: e.target.value })
                    }
                    rows={3}
                  />
                </div>
              ),
            )}
            <Button type="button" variant="secondary" onClick={addInstruction}>
              <Plus className="mr-2 h-4 w-4" />
              Add Instruction
            </Button>
          </FormSection>

          <FormSection title="Prize Catalogue">
            {errors.prize_catalogue && (
              <div className="mb-4 rounded-md border border-red-500 bg-red-500/20 p-3">
                <p className="text-red-300">{errors.prize_catalogue}</p>
              </div>
            )}

            {(formData.prize_catalogue || []).map(
              (prize: any, index: number) => (
                <div key={index} className="mb-4 rounded-md border  p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="push font-medium">Prize #{index + 1}</h3>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => removePrize(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <FormInput
                    label="Prize Name"
                    placeholder="Enter prize name"
                    value={prize.prize_name || ""}
                    onChange={(e) =>
                      updatePrize(index, { prize_name: e.target.value })
                    }
                    error={errors[`prize_name_${index}`]}
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <ColorPicker
                      label="Text Color"
                      value={prize.text_color || "#FFFFFF"}
                      onChange={(color) =>
                        updatePrize(index, { text_color: color })
                      }
                    />
                    <ColorPicker
                      label="Background Color"
                      value={prize.background_color || "#1F2937"}
                      onChange={(color) =>
                        updatePrize(index, { background_color: color })
                      }
                    />
                  </div>

                  <div className="mb-2 mt-4">
                    <label className="push mb-1 block text-sm font-medium">
                      Gradient Color
                    </label>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <FormSelect
                        label="Direction"
                        options={[
                          { value: "to-right", label: "To Right" },
                          { value: "to-left", label: "To Left" },
                          { value: "to-top", label: "To Top" },
                          { value: "to-bottom", label: "To Bottom" },
                        ]}
                        value={prize.gradient_color?.direction || "to-right"}
                        onChange={(e) =>
                          updatePrize(index, {
                            gradient_color: {
                              ...prize.gradient_color,
                              direction: e.target.value as
                                | "to-right"
                                | "to-left"
                                | "to-top"
                                | "to-bottom",
                            },
                          })
                        }
                      />
                      <ColorPicker
                        label="Start Color"
                        value={prize.gradient_color?.start || "#6366F1"}
                        onChange={(color) =>
                          updatePrize(index, {
                            gradient_color: {
                              ...prize.gradient_color,
                              start: color,
                            },
                          })
                        }
                      />
                      <ColorPicker
                        label="End Color"
                        value={prize.gradient_color?.end || "#8B5CF6"}
                        onChange={(color) =>
                          updatePrize(index, {
                            gradient_color: {
                              ...prize.gradient_color,
                              end: color,
                            },
                          })
                        }
                      />
                    </div>
                  </div>

                  <ImageUpload
                    label="Prize Image"
                    value={prize.image || ""}
                    onChange={(base64) => updatePrize(index, { image: base64 })}
                  />

                  <FormInput
                    label="Quantity"
                    type="number"
                    min="0"
                    placeholder="Enter quantity"
                    value={prize.quantity?.toString() || "0"}
                    onChange={(e) =>
                      updatePrize(index, { quantity: parseInt(e.target.value) })
                    }
                  />

                  <div className="mb-2 mt-4">
                    <label className="push mb-1 block text-sm font-medium">
                      Reward Type (Choose one)
                    </label>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <FormInput
                        label="Fever Bucks"
                        type="number"
                        min="0"
                        placeholder="Enter fever bucks"
                        value={prize.fever_bucks?.toString() || ""}
                        onChange={(e) =>
                          updatePrize(index, {
                            fever_bucks: parseInt(e.target.value),
                            rewards: undefined,
                            coupon_type: undefined,
                          })
                        }
                      />
                      <FormInput
                        label="Rewards"
                        placeholder="Enter rewards"
                        value={prize.rewards || ""}
                        onChange={(e) =>
                          updatePrize(index, {
                            rewards: e.target.value,
                            fever_bucks: undefined,
                            coupon_type: undefined,
                          })
                        }
                      />
                      <FormInput
                        label="Coupon Type"
                        placeholder="Enter coupon type"
                        value={prize.coupon_type || ""}
                        onChange={(e) =>
                          updatePrize(index, {
                            coupon_type: e.target.value,
                            fever_bucks: undefined,
                            rewards: undefined,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              ),
            )}

            <Button type="button" variant="secondary" onClick={addPrize}>
              <Plus className="mr-2 h-4 w-4" />
              Add Prize
            </Button>
          </FormSection>

          <FormSection title="Questions">
            {errors.questions && (
              <div className="mb-4 rounded-md border border-red-500 bg-red-500/20 p-3">
                <p className="text-red-300">{errors.questions}</p>
              </div>
            )}

            {(formData.questions || []).map((question: any, index: number) => (
              <div
                key={index}
                className="mb-4 rounded-md border border-white/10 bg-white/5 p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="push font-medium">Question #{index + 1}</h3>
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
                  value={question.question || ""}
                  onChange={(e) =>
                    updateQuestion(index, { question: e.target.value })
                  }
                  error={errors[`question_${index}`]}
                  rows={2}
                />

                <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormInput
                    label="Option 1"
                    placeholder="Enter option 1"
                    value={question.option1 || ""}
                    onChange={(e) =>
                      updateQuestion(index, { option1: e.target.value })
                    }
                    error={errors[`option1_${index}`]}
                  />
                  <FormInput
                    label="Option 2"
                    placeholder="Enter option 2"
                    value={question.option2 || ""}
                    onChange={(e) =>
                      updateQuestion(index, { option2: e.target.value })
                    }
                    error={errors[`option2_${index}`]}
                  />
                  <FormInput
                    label="Option 3"
                    placeholder="Enter option 3"
                    value={question.option3 || ""}
                    onChange={(e) =>
                      updateQuestion(index, { option3: e.target.value })
                    }
                    error={errors[`option3_${index}`]}
                  />
                  <FormInput
                    label="Option 4"
                    placeholder="Enter option 4"
                    value={question.option4 || ""}
                    onChange={(e) =>
                      updateQuestion(index, { option4: e.target.value })
                    }
                    error={errors[`option4_${index}`]}
                  />
                </div>

                <FormSelect
                  label="Correct Option"
                  options={[
                    { value: "option1", label: "Option 1" },
                    { value: "option2", label: "Option 2" },
                    { value: "option3", label: "Option 3" },
                    { value: "option4", label: "Option 4" },
                  ]}
                  value={question.correctOption || "option1"}
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
              </div>
            ))}

            <Button type="button" variant="secondary" onClick={addQuestion}>
              <Plus className="mr-2 h-4 w-4" />
              Add Question
            </Button>
          </FormSection>

          <div className="mt-8 flex justify-end gap-4">
            <Button type="button" variant="secondary" onClick={handlePreview}>
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Save & Continue
            </Button>
          </div>
        </form>
        <SuccessModal isOpen={isModalOpen} onClose={handleCloseModal} />
      </div>
    </PageLayout>
  );
};

export default ContestForm;
