import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { ContestFormData, TambolaFormData } from "../types";

interface ContestContextType {
  formData: Partial<ContestFormData>;
  updateFormData: (data: Partial<ContestFormData>) => void;
  resetFormData: () => void;

  tambolaFormData: Partial<TambolaFormData>;
  tambolaupdateFormData: (data: Partial<TambolaFormData>) => void;
  tambolaresetFormData: () => void;
}

const ContestContext = createContext<ContestContextType | undefined>(undefined);

export const ContestProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [formData, setFormData] = useState<Partial<ContestFormData>>({
    contest_type: "FREE",
    game_proceed: {
      submitBtn: "Proceed to Game",
    },
    instructions: [
      {
        title: "",
        description: "Get a Tambola ticket and wait for contestto begin",
      },
      {
        title: "",
        description:
          "Ensure that you mark the numbers onyour ticket that have been called out",
      },
      {
        title: "",
        description:
          "The number will be marked in RED incase automatically in case you missedto mark",
      },
      {
        title: "",
        description:
          "Categories to win:- Full House, Lines, Corners, and early 5",
      },
    ],
    prize_catalogue: [],
    questions: [
      {
        question: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        correctOption: "option1",
        timer: "10",
      },
    ],
    winners: [{ reward_id: 1, bucks: 0, qty: 0, balance_coupons: 0 }],
    game_time_level: "GAME",
    flip_allowed: 1,
    flip_count: 1,
    isPopular: 0,
    fever_logo: false,
  });

  const [tambolaFormData, setTambolaFormData] = useState<
    Partial<TambolaFormData>
  >({
    contest_type: "FREE",
    game_proceed: {
      submitBtn: "Proceed to Game",
    },
    instructions: [],
    prize_catalogue: [],
  });

  const updateFormData = (data: Partial<ContestFormData>) => {
    const handleImageChange = (
      field: keyof ContestFormData,
      base64: string,
    ) => {
      // Convert base64 to File object
      const byteString = atob(base64.split(",")[1]);
      const mimeString = base64.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const file = new File([ab], `${field}.${mimeString.split("/")[1]}`, {
        type: mimeString,
      });
      setFormData((prev) => ({
        ...prev,
        [field]: file,
        [`${field}_preview`]: base64,
      }));
    };

    // Check if any image field is a empty string

    let imageFields: (keyof ContestFormData)[] = [
      "contest_hero_logo",
      "contest_image",
      "sponsor_logo",
      "thumbnail",
    ];

    imageFields.forEach((field) => {
      if (data[field] === "") {
        setFormData((prev) => ({ ...prev, [`${field}_preview`]: "" }));
      }
    });

    if (
      data.contest_hero_logo ||
      data.contest_image ||
      data.sponsor_logo ||
      data.thumbnail
    ) {
      // Handle each image field separately
      if (
        data.contest_hero_logo &&
        typeof data.contest_hero_logo === "string"
      ) {
        handleImageChange("contest_hero_logo", data.contest_hero_logo);
      }
      if (data.contest_image && typeof data.contest_image === "string") {
        handleImageChange("contest_image", data.contest_image);
      }
      if (data.sponsor_logo && typeof data.sponsor_logo === "string") {
        handleImageChange("sponsor_logo", data.sponsor_logo);
      }
      if (data.thumbnail && typeof data.thumbnail === "string") {
        handleImageChange("thumbnail", data.thumbnail);
      }
    } else {
      setFormData((prev) => ({ ...prev, ...data }));
    }
  };
  const tambolaupdateFormData = (data: Partial<TambolaFormData>) => {
    console.log(data);
    setTambolaFormData((prev) => ({ ...prev, ...data }));
  };

  const resetFormData = () => {
    setFormData({
      contest_type: "FREE",
      game_proceed: {
        submitBtn: "Proceed to Game",
      },
      instructions: [
        {
          title: "",
          description: "Get a Tambola ticket and wait for contestto begin",
        },
        {
          title: "",
          description:
            "Ensure that you mark the numbers onyour ticket that have been called out",
        },
        {
          title: "",
          description:
            "The number will be marked in RED incase automatically in case you missedto mark",
        },
        {
          title: "",
          description:
            "Categories to win:- Full House, Lines, Corners, and early 5",
        },
      ],
      prize_catalogue: [],
      questions: [
        {
          question: "",
          option1: "",
          option2: "",
          option3: "",
          option4: "",
          correctOption: "option1",
          timer: "10",
        },
      ],
      winners: [{ reward_id: 1, bucks: 0, qty: 0, balance_coupons: 0 }],
      game_time_level: "GAME",
      flip_allowed: 1,
      flip_count: 0,
      flip_fee: 0,
      isPopular: 0,
      fever_logo: false,
    });
  };

  const tambolaresetFormData = () => {
    setTambolaFormData({
      contest_type: "FREE",
      game_proceed: {
        submitBtn: "Proceed to Game",
      },
      instructions: [],
      prize_catalogue: [],
    });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  return (
    <ContestContext.Provider
      value={{
        formData,
        tambolaFormData, // ✅ FIXED: Name corrected
        tambolaupdateFormData,
        updateFormData,
        resetFormData,
        tambolaresetFormData,
      }}
    >
      {children}
    </ContestContext.Provider>
  );
};

export const useContest = () => {
  const context = useContext(ContestContext);
  if (context === undefined) {
    throw new Error("useContest must be used within a ContestProvider");
  }
  return context;
};
