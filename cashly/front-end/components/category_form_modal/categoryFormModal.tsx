"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { createCategory, updateCategory } from "@/lib/redux/slices/categoriesSlice";
import { CategoryCreateDto, CategoryResponseDto, CategoryUpdateDto } from "@/lib/types/category";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { SparklesIcon, PencilIcon } from "@heroicons/react/24/solid";
import IconSelector, { getCategoryIcon } from "./iconSelector";
import ColorSelector from "./colorSelector";

interface CategoryFormModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onSuccess?: () => void;
  mode?: "create" | "edit";
  category?: CategoryResponseDto; // Per modalità edit
}

export default function CategoryFormModal({ isOpen, onOpenChange, onSuccess, mode = "create", category }: CategoryFormModalProps) {
  const dispatch = useAppDispatch();

  const isEditMode = mode === "edit" && category;
  const isProcessing = useAppSelector((state) => state.categories.isPerformingAction);

  // Form state
  const [formData, setFormData] = useState<CategoryCreateDto | CategoryUpdateDto>({
    categoryName: "",
    iconName: "tag",
    colorHex: "#3B82F6",
  });

  // Initialize form with category data in edit mode or reset in create mode
  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        // Edit mode: carica i dati della categoria esistente
        setFormData({
          categoryName: category.categoryName,
          iconName: category.iconName || "tag",
          colorHex: category.colorHex || "#3B82F6",
        });
      } else {
        // Create mode: reset form
        setFormData({
          categoryName: "",
          iconName: "tag",
          colorHex: "#3B82F6",
        });
      }
    }
  }, [isOpen, isEditMode, category]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validazione base
    if (!formData.categoryName.trim()) {
      return;
    }

    try {
      if (isEditMode) {
        // Update existing category
        await dispatch(
          updateCategory({
            categoryId: category.categoryId,
            data: formData as CategoryUpdateDto,
          })
        );
      } else {
        // Create new category
        await dispatch(createCategory(formData as CategoryCreateDto));
      }

      onOpenChange();
      onSuccess?.();
    } catch (error: any) {}
  };

  // Modal title and button text based on mode
  const modalTitle = isEditMode ? "Modifica Categoria" : "Crea Nuova Categoria";
  const modalSubtitle = isEditMode ? "Modifica i dettagli della categoria" : "Personalizza la tua categoria con nome, icona e colore";
  const submitButtonText = isEditMode ? "Salva Modifiche" : "Crea Categoria";
  const submitButtonIcon = isEditMode ? <PencilIcon className="w-5 h-5" /> : <SparklesIcon className="w-5 h-5" />;

  // Get icon component for preview
  const IconComponent = getCategoryIcon(formData.iconName);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" scrollBehavior="inside" placement="center" backdrop="blur">
      <ModalContent as="form" onSubmit={handleSubmit}>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold">{modalTitle}</h2>
              <p className="text-sm text-default-500 font-normal">{modalSubtitle}</p>
            </ModalHeader>

            <ModalBody className="gap-6">
              {/* Nome Categoria */}
              <Input
                label="Nome Categoria"
                placeholder="Es: Stipendio, Spese Casa, Shopping..."
                value={formData.categoryName}
                onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                required
                variant="bordered"
                size="lg"
                maxLength={100}
                isDisabled={isProcessing}
              />

              {/* Selettore Icona */}
              <IconSelector value={formData.iconName || ""} onChange={(icon) => setFormData({ ...formData, iconName: icon })} />

              {/* Selettore Colore */}
              <ColorSelector value={formData.colorHex || "#3B82F6"} onChange={(color) => setFormData({ ...formData, colorHex: color })} />

              {/* Preview */}
              <div>
                <label className="block text-sm font-medium mb-3">Anteprima</label>
                <div className="flex items-center gap-4 p-4 border-2 border-default-200 rounded-lg bg-default-50">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300"
                    style={{ backgroundColor: formData.colorHex }}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{formData.categoryName || "Nome categoria"}</p>
                    <p className="text-sm text-default-500">
                      {formData.iconName} • {formData.colorHex}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messaggio informativo per edit mode */}
              {isEditMode && (
                <div className="p-3 bg-warning-50 border border-warning-200 rounded-lg">
                  <p className="text-sm text-warning-700">⚠️ Le modifiche alla categoria saranno applicate a tutte le transazioni collegate.</p>
                </div>
              )}
            </ModalBody>

            <ModalFooter>
              <Button onPress={onClose} variant="flat" isDisabled={isProcessing}>
                Annulla
              </Button>
              <Button type="submit" color="primary" isLoading={isProcessing} startContent={!isProcessing && submitButtonIcon}>
                {submitButtonText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
