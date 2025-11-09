import { CategoryResponseDto } from "@/lib/types/category";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";

import { TrashIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { getCategoryIcon } from "./iconSelector";

// Componente Card Categoria
export default function CategoryCard({
  category,
  onDelete,
  isDeleting,
}: {
  category: CategoryResponseDto;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const IconComponent = getCategoryIcon(category.iconName);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleConfirmDelete = () => {
    onDelete();
    onOpenChange(); // Chiudi il modal
  };

  return (
    <>
      <Card className="border-2 border-default-300 hover:border-primary transition-colors">
        <CardBody className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              {/* Icona colorata */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
                style={{ backgroundColor: category.colorHex || "#64748B" }}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>

              {/* Info categoria */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate">{category.categoryName}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {category.iconName && (
                    <Chip size="sm" variant="flat" className="text-xs">
                      {category.iconName}
                    </Chip>
                  )}
                  <Chip size="sm" variant="flat" className="text-xs">
                    {category.colorHex}
                  </Chip>
                </div>
              </div>
            </div>

            {/* Bottone elimina */}
            <Tooltip content="Elimina categoria" color="danger">
              <Button isIconOnly color="danger" variant="flat" size="sm" onPress={onOpen} isDisabled={isDeleting} className="ml-2">
                <TrashIcon className="w-4 h-4" />
              </Button>
            </Tooltip>
          </div>
        </CardBody>
      </Card>

      {/* Modal di conferma eliminazione */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <ExclamationTriangleIcon className="w-6 h-6 text-danger" />
                  <span>Conferma Eliminazione</span>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <p className="text-default-600">
                    Sei sicuro di voler eliminare la categoria <strong className="text-foreground">"{category.categoryName}"</strong>?
                  </p>

                  {/* Preview della categoria da eliminare */}
                  <div className="flex items-center gap-3 p-3 bg-danger-50 border border-danger-200 rounded-lg">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm"
                      style={{ backgroundColor: category.colorHex || "#64748B" }}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">{category.categoryName}</p>
                      <p className="text-xs text-default-500">
                        {category.iconName} • {category.colorHex}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-danger">⚠️ Questa azione non può essere annullata.</p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose} isDisabled={isDeleting}>
                  Annulla
                </Button>
                <Button
                  color="danger"
                  onPress={handleConfirmDelete}
                  isLoading={isDeleting}
                  startContent={!isDeleting && <TrashIcon className="w-4 h-4" />}>
                  Elimina
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
