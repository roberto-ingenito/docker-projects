"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchCategories } from "@/lib/redux/slices/categoriesSlice";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/use-disclosure";
import { Spinner } from "@heroui/spinner";

import { PlusIcon, TagIcon } from "@heroicons/react/24/solid";
import CategoryCard from "./(components)/categoryCard";
import CategoryFormModal from "@/components/category_form_modal/categoryFormModal";

export default function CategoriesPage() {
  const dispatch = useAppDispatch();

  const categories = useAppSelector((state) => state.categories.categories);
  const isLoading = useAppSelector((state) => state.categories.isLoading);
  const error = useAppSelector((state) => state.categories.error);
  const firstLoadDone = useAppSelector((state) => state.categories.firstLoadDone);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    if (!firstLoadDone) dispatch(fetchCategories());
  }, []);

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Le Tue Categorie</h1>
          <p className="text-foreground/80 mt-2">Organizza le tue transazioni con categorie personalizzate</p>
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
                <CategoryCard key={category.categoryId} category={category} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal Crea Categoria */}
      <CategoryFormModal mode="create" isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
}
