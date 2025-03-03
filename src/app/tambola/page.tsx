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
import { TambolaPrizeCatalogue, Instruction } from "../../types";
import SuccessModal from "../../components/SuccessPopup";
import { PageLayout } from "@/components";

const TambolaContestForm: React.FC = () => {
  const { push } = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { tambolaFormData, tambolaupdateFormData } = useContest();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Basic validation for required fields
    if (
      !tambolaFormData.contest_name ||
      tambolaFormData.contest_name.length < 3
    ) {
      newErrors.contest_name = "Contest name is required (min 3 characters)";
    }

    if (
      !tambolaFormData.reward_name ||
      tambolaFormData.reward_name.length < 3
    ) {
      newErrors.reward_name = "Reward name is required (min 3 characters)";
    }

    if (!tambolaFormData.start_date) {
      newErrors.start_date = "Start date is required";
    }

    if (!tambolaFormData.start_time) {
      newErrors.start_time = "Start time is required";
    }

    if (!tambolaFormData.end_date) {
      newErrors.end_date = "End date is required";
    }

    if (!tambolaFormData.end_time) {
      newErrors.end_time = "End time is required";
    }

    if (
      tambolaFormData.contest_type === "PAID" &&
      (!tambolaFormData.contest_fee || tambolaFormData.contest_fee < 1)
    ) {
      newErrors.contest_fee =
        "Contest fee is required for paid contests (min: 1)";
    }

    if (
      !tambolaFormData.contest_entry_note ||
      tambolaFormData.contest_entry_note.length < 3
    ) {
      newErrors.contest_entry_note =
        "Contest Entry Note is required (min 3 characters)";
    }

    if (
      !tambolaFormData.sponsor_name ||
      tambolaFormData.sponsor_name.length < 3
    ) {
      newErrors.sponsor_name = "Sponsor name is required (min 3 characters)";
    }

    if (!tambolaFormData.sponsor_logo) {
      newErrors.sponsor_logo = "Sponsor logo is required";
    }

    if (!tambolaFormData.thumbnail) {
      newErrors.thumbnail = "Thumbnail is required";
    }

    if (!tambolaFormData.contest_image) {
      newErrors.contest_image = "Contest image is required";
    }

    if (!tambolaFormData.contest_hero_logo) {
      newErrors.contest_hero_logo = "Contest hero logo is required";
    }

    if (
      !tambolaFormData.prize_description ||
      tambolaFormData.prize_description.length < 3
    ) {
      newErrors.prize_description =
        "Prize Description is required (min 3 characters)";
    }

    if (!tambolaFormData.game_proceed?.submitBtn) {
      newErrors.game_proceed_submitBtn = "Submit button text is required";
    }

    // Prize catalogue validation
    if (
      !tambolaFormData.prize_catalogue ||
      tambolaFormData.prize_catalogue.length === 0
    ) {
      newErrors.prize_catalogue = "At least one prize is required";
    } else {
      tambolaFormData.prize_catalogue.forEach((prize, index) => {
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
        if (!prize.prize_type) {
          newErrors[`prize_type_${index}`] = "Prize type is required";
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // ✅ User Input Se JSON Generate Karna
      const TambolaJson = {
        contest_name: tambolaFormData.contest_name || "",
        reward_name: tambolaFormData.reward_name || "",
        start_date: tambolaFormData.start_date || "",
        start_time: tambolaFormData.start_time || "",
        end_date: tambolaFormData.end_date || "",
        end_time: tambolaFormData.end_time || "",
        contest_type: tambolaFormData.contest_type || "FREE",
        contest_entry_note: tambolaFormData.contest_entry_note || "",
        contest_fee: tambolaFormData.contest_fee || 0,
        contest_type_name: tambolaFormData.contest_type_name || "",
        sponsor_name: tambolaFormData.sponsor_name || "",
        sponsor_logo: tambolaFormData.sponsor_logo || "",
        thumbnail: tambolaFormData.thumbnail || "",
        contest_image: tambolaFormData.contest_image || "",
        contest_hero_logo: tambolaFormData.contest_hero_logo || "",
        prize_description: tambolaFormData.prize_description || "",
        instructions: tambolaFormData.instructions || [],
        wheel_prizes: tambolaFormData.prize_catalogue || [],
      };

      // ✅ Console me JSON Print Karna
      console.log("🚀 Submitted JSON:", TambolaJson);

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

  const handleCloseModal = () => {
    setIsModalOpen(false);

    // ✅ Form ko reset karna using updateFormData
    tambolaupdateFormData({
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

  const handlePreview = () => {
    if (validateForm()) {
      push("/preview");
    } else {
      window.scrollTo(0, 0);
    }
  };

  const addPrize = () => {
    const newPrize: TambolaPrizeCatalogue = {
      prize_type: "Full House",
      prize_name: "",
      text_color: "#FFFFFF",
      gradient_color: {
        direction: "to-right",
        start: "#6366F1",
        end: "#8B5CF6",
      },
      background_color: "#1F2937",
      image: "",
    };

    tambolaupdateFormData({
      prize_catalogue: [...(tambolaFormData.prize_catalogue || []), newPrize],
    });
  };

  const updatePrize = (index: number, data: Partial<TambolaPrizeCatalogue>) => {
    const updatedPrizes = [...(tambolaFormData.prize_catalogue || [])];
    updatedPrizes[index] = { ...updatedPrizes[index], ...data };
    tambolaupdateFormData({ prize_catalogue: updatedPrizes });
  };

  const removePrize = (index: number) => {
    const updatedPrizes = [...(tambolaFormData.prize_catalogue || [])];
    updatedPrizes.splice(index, 1);
    tambolaupdateFormData({ prize_catalogue: updatedPrizes });
  };

  const addInstruction = () => {
    const newInstruction: Instruction = {
      title: "",
      description: "",
    };

    tambolaupdateFormData({
      instructions: [...(tambolaFormData.instructions || []), newInstruction],
    });
  };

  const updateInstruction = (index: number, data: Partial<Instruction>) => {
    const updatedInstructions = [...(tambolaFormData.instructions || [])];
    updatedInstructions[index] = { ...updatedInstructions[index], ...data };
    tambolaupdateFormData({ instructions: updatedInstructions });
  };

  const removeInstruction = (index: number) => {
    const updatedInstructions = [...(tambolaFormData.instructions || [])];
    updatedInstructions.splice(index, 1);
    tambolaupdateFormData({ instructions: updatedInstructions });
  };

  return (
    <PageLayout>
      <div className="mx-auto max-w-4xl py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold ">Create Contest ( Tambola )</h1>
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
                value={tambolaFormData.contest_name || ""}
                onChange={(e) =>
                  tambolaupdateFormData({ contest_name: e.target.value })
                }
                error={errors.contest_name}
              />
              <FormInput
                label="Reward Name"
                placeholder="Enter reward name"
                value={tambolaFormData.reward_name || ""}
                onChange={(e) =>
                  tambolaupdateFormData({ reward_name: e.target.value })
                }
                error={errors.reward_name}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <FormInput
                  label="Start Date"
                  type="date"
                  value={tambolaFormData.start_date || ""}
                  onChange={(e) =>
                    tambolaupdateFormData({ start_date: e.target.value })
                  }
                  error={errors.start_date}
                />
              </div>
              <div>
                <FormInput
                  label="Start Time"
                  type="time"
                  value={tambolaFormData.start_time || ""}
                  onChange={(e) =>
                    tambolaupdateFormData({ start_time: e.target.value })
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
                  value={tambolaFormData.end_date || ""}
                  onChange={(e) =>
                    tambolaupdateFormData({ end_date: e.target.value })
                  }
                  error={errors.end_date}
                />
              </div>
              <div>
                <FormInput
                  label="End Time"
                  type="time"
                  value={tambolaFormData.end_time || ""}
                  onChange={(e) =>
                    tambolaupdateFormData({ end_time: e.target.value })
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
                value={tambolaFormData.contest_type || "FREE"}
                onChange={(e) =>
                  tambolaupdateFormData({
                    contest_type: e.target.value as "FREE" | "PAID",
                  })
                }
              />
              {tambolaFormData.contest_type === "PAID" && (
                <FormInput
                  label="Contest Fee"
                  type="number"
                  min="1"
                  placeholder="Enter contest fee"
                  value={tambolaFormData.contest_fee?.toString() || ""}
                  onChange={(e) =>
                    tambolaupdateFormData({
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
                value={tambolaFormData.contest_type_name || ""}
                onChange={(e) =>
                  tambolaupdateFormData({ contest_type_name: e.target.value })
                }
              />
              <FormInput
                label="Contest Variant Name (Optional)"
                placeholder="E.g., Summer Edition"
                value={tambolaFormData.contest_variant_name || ""}
                onChange={(e) =>
                  tambolaupdateFormData({
                    contest_variant_name: e.target.value,
                  })
                }
              />
            </div>

            <FormInput
              label="Sponsor Name"
              placeholder="Enter sponsor name"
              value={tambolaFormData.sponsor_name || ""}
              onChange={(e) =>
                tambolaupdateFormData({ sponsor_name: e.target.value })
              }
              error={errors.sponsor_name}
            />

            {/* ✅ New Fields Added */}
            <FormInput
              label="Contest Entry Note"
              placeholder="Enter contest entry note"
              value={tambolaFormData.contest_entry_note || ""}
              onChange={(e) =>
                tambolaupdateFormData({ contest_entry_note: e.target.value })
              }
            />

            <FormInput
              label="Prize Description"
              placeholder="Enter prize description"
              value={tambolaFormData.prize_description || ""}
              onChange={(e) =>
                tambolaupdateFormData({ prize_description: e.target.value })
              }
            />
          </FormSection>

          <FormSection title="Images">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <ImageUpload
                label="Sponsor Logo"
                value={tambolaFormData.sponsor_logo || ""}
                onChange={(base64) => {
                  console.log("Sponsor Logo Updated:", base64);
                  tambolaupdateFormData({ sponsor_logo: base64 || "" });
                }}
                error={errors.sponsor_logo}
              />
              <ImageUpload
                label="Thumbnail"
                value={tambolaFormData.thumbnail || ""}
                onChange={(base64) => {
                  console.log("Thumbnail Updated:", base64);
                  tambolaupdateFormData({ thumbnail: base64 || "" });
                }}
                error={errors.thumbnail}
              />
              <ImageUpload
                label="Contest Image"
                value={tambolaFormData.contest_image || ""}
                onChange={(base64) => {
                  console.log("Contest Image Updated:", base64);
                  tambolaupdateFormData({ contest_image: base64 || "" });
                }}
                error={errors.contest_image}
              />
              <ImageUpload
                label="Contest Hero Logo"
                value={tambolaFormData.contest_hero_logo || ""}
                onChange={(base64) => {
                  console.log("Contest Hero Logo Updated:", base64);
                  tambolaupdateFormData({ contest_hero_logo: base64 || "" });
                }}
                error={errors.contest_hero_logo}
              />
            </div>
          </FormSection>

          <FormSection title="Game Settings">
            <FormInput
              label="Proceed Button Text"
              placeholder="E.g., Proceed to Game"
              value={
                tambolaFormData.game_proceed?.submitBtn || "Proceed to Game"
              }
              onChange={(e) =>
                tambolaupdateFormData({
                  game_proceed: {
                    submitBtn: e.target.value || "Proceed to Game", // 🛠 Ensure submitBtn is never undefined
                    Tnc: tambolaFormData.game_proceed?.Tnc || "", // Preserve existing Tnc value
                  },
                })
              }
              error={errors.game_proceed_submitBtn}
            />

            <FormTextarea
              label="Terms & Conditions (Optional)"
              placeholder="Enter terms and conditions"
              value={tambolaFormData.game_proceed?.Tnc || ""}
              onChange={(e) =>
                tambolaupdateFormData({
                  game_proceed: {
                    submitBtn:
                      tambolaFormData.game_proceed?.submitBtn ||
                      "Proceed to Game", // 🛠 Preserve submitBtn value
                    Tnc: e.target.value,
                  },
                })
              }
              rows={4}
            />
          </FormSection>

          <FormSection title="Instructions (Optional)">
            {(tambolaFormData.instructions || []).map((instruction, index) => (
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
                    updateInstruction(index, { description: e.target.value })
                  }
                  rows={3}
                />
              </div>
            ))}
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

            {(tambolaFormData.prize_catalogue || []).map((prize, index) => (
              <div
                key={index}
                className="mb-4 rounded-md border border-white/10 bg-white/5 p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-medium ">Prize #{index + 1}</h3>
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
                <FormSelect
                  label="Prize Type"
                  options={[
                    { value: "FullHouse", label: "Full House" },
                    { value: "FirstLine", label: "First Line" },
                    { value: "SecondLine", label: "Second Line" },
                    { value: "ThirdLine", label: "Third Line" },
                    { value: "Corner", label: "Corner" },
                    { value: "Early5", label: "Early 5" },
                  ]}
                  value={tambolaFormData.contest_type || "FREE"}
                  onChange={(e) =>
                    tambolaupdateFormData({
                      contest_type: e.target.value as "FREE" | "PAID",
                    })
                  }
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
                  <label className="mb-1 block text-sm font-medium ">
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
              </div>
            ))}

            <Button type="button" variant="secondary" onClick={addPrize}>
              <Plus className="mr-2 h-4 w-4" />
              Add Prize
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

export default TambolaContestForm;
