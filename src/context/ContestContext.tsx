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
    instructions: [],
    prize_catalogue: [],
    questions: [],
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
    console.log({ data });
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const tambolaupdateFormData = (data: Partial<TambolaFormData>) => {
    console.log({ data });
    setTambolaFormData((prev) => ({ ...prev, ...data }));
  };

  const resetFormData = () => {
    setFormData({
      contest_type: "FREE",
      game_proceed: {
        submitBtn: "Proceed to Game",
      },
      instructions: [],
      prize_catalogue: [],
      questions: [],
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
    console.log({ formData });
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
