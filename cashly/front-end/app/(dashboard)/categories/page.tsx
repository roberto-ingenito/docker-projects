"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { getCategories, createCategory, deleteCategory } from "@/lib/redux/slices/categoriesSlice";
import { CategoryCreateDto } from "@/lib/types/category";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Modal } from "@heroui/modal";
import { ModalContent } from "@heroui/modal";
import { ModalHeader } from "@heroui/modal";
import { ModalBody } from "@heroui/modal";
import { ModalFooter } from "@heroui/modal";
import { useDisclosure } from "@heroui/use-disclosure";
import { Spinner } from "@heroui/spinner";

import { PlusIcon, TagIcon, SparklesIcon } from "@heroicons/react/24/solid";
import CategoryCard from "./(components)/categoryCard";
import ColorSelector from "./(components)/colorSelector";
import IconSelector, { getCategoryIcon } from "./(components)/iconSelector";

export default function CategoriesPage() {
  const dispatch = useAppDispatch();

  const categories = useAppSelector((state) => state.categories.categories);
  const isLoading = useAppSelector((state) => state.categories.isLoading);
  const error = useAppSelector((state) => state.categories.error);
  const firstLoadDone = useAppSelector((state) => state.categories.firstLoadDone);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<CategoryCreateDto>({
    categoryName: "",
    iconName: "tag",
    colorHex: "#3B82F6",
  });

  useEffect(() => {
    if (!firstLoadDone) dispatch(getCategories());
  }, []);

  const handleCreateCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(createCategory(formData));
    if (result.meta.requestStatus === "fulfilled") {
      setFormData({
        categoryName: "",
        iconName: "tag",
        colorHex: "#3B82F6",
      });
      onOpenChange();
    }
  };

  const handleDelete = async (categoryId: number) => {
    setDeletingId(categoryId);
    await dispatch(deleteCategory(categoryId));
    setDeletingId(null);
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-primary bg-clip-text text-transparent">Le Tue Categorie</h1>
          <p className="text-default-500 mt-2">Organizza le tue transazioni con categorie personalizzate</p>
        </div>
        <Button color="primary" size="lg" startContent={<PlusIcon className="w-5 h-5" />} onPress={onOpen} className="w-full sm:w-auto font-semibold">
          Nuova Categoria
        </Button>
      </div>

      {/* Messaggio errore */}
      {error && (
        <Card className="mb-6 border-l-4 border-danger">
          <CardBody className="bg-danger-50">
            <p className="text-danger font-medium">{error}</p>
          </CardBody>
        </Card>
      )}

      {/* Lista Categorie */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Spinner size="lg" color="primary" />
            <p className="text-default-500 mt-4">Caricamento categorie...</p>
          </div>
        ) : categories.length === 0 ? (
          <Card className="border-2 border-dashed border-default-300">
            <CardBody className="py-20">
              <div className="text-center">
                <TagIcon className="w-16 h-16 mx-auto text-default-300 mb-4" />
                <h3 className="text-xl font-semibold text-default-600 mb-2">Nessuna categoria</h3>
                <p className="text-default-500 mb-6">Crea la tua prima categoria per iniziare a organizzare le transazioni</p>
                <Button color="primary" variant="flat" startContent={<PlusIcon className="w-5 h-5" />} onPress={onOpen}>
                  Nuova Categoria
                </Button>
              </div>
            </CardBody>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-default-600 font-medium">
                {categories.length} {categories.length === 1 ? "categoria" : "categorie"}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <CategoryCard
                  key={category.categoryId}
                  category={category}
                  onDelete={() => handleDelete(category.categoryId)}
                  isDeleting={deletingId === category.categoryId}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal Crea Categoria */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" scrollBehavior="inside" placement="center" backdrop="blur">
        <ModalContent as="form" onSubmit={handleCreateCategorySubmit}>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold">Crea Nuova Categoria</h2>
                <p className="text-sm text-default-500 font-normal">Personalizza la tua categoria con nome, icona e colore</p>
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
                />

                {/* Selettore Icona */}
                <IconSelector value={formData.iconName || ""} onChange={(icon) => setFormData({ ...formData, iconName: icon })} />

                {/* Selettore Colore */}
                <ColorSelector value={formData.colorHex || "#3B82F6"} onChange={(color) => setFormData({ ...formData, colorHex: color })} />

                {/* Preview */}
                <div>
                  <label className="block text-sm font-medium mb-3">Anteprima</label>
                  <div className="flex items-center gap-4 p-4 border-2 border-default-200 rounded-lg bg-default-50">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: formData.colorHex }}>
                      {(() => {
                        const Icon = getCategoryIcon(formData.iconName);
                        return <Icon className="w-8 h-8 text-white" />;
                      })()}
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{formData.categoryName || "Nome categoria"}</p>
                      <p className="text-sm text-default-500">
                        {formData.iconName} • {formData.colorHex}
                      </p>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose} variant="flat">
                  Annulla
                </Button>
                <Button type="submit" color="primary" isLoading={isLoading} startContent={!isLoading && <SparklesIcon className="w-5 h-5" />}>
                  Crea Categoria
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
