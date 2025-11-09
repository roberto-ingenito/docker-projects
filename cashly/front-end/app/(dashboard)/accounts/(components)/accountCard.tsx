import { Account } from "@/lib/types/account";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";

import { TrashIcon, ExclamationTriangleIcon, WalletIcon, CalendarIcon } from "@heroicons/react/24/solid";

export default function AccountCard({
    account,
    onDelete,
    isDeleting,
}: {
    account: Account;
    onDelete: () => void;
    isDeleting: boolean;
}) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const handleConfirmDelete = () => {
        onDelete();
        onOpenChange();
    };

    // Formatta la data
    const createdDate = new Date(account.createdAt).toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    // Determina il colore in base al saldo
    const balanceColor = account.currentBalance >= 0 ? "text-success" : "text-danger";
    const balanceBgColor = account.currentBalance >= 0 ? "bg-success-50" : "bg-danger-50";

    return (
        <>
            <Card className="border-2 border-default-300 hover:border-primary transition-colors">
                <CardBody className="p-5">
                    <div className="space-y-4">
                        {/* Header con nome e bottone elimina */}
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3 flex-1">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <WalletIcon className="w-6 h-6 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-lg truncate">{account.accountName}</h3>
                                    <div className="flex items-center gap-1 mt-1 text-xs text-default-500">
                                        <CalendarIcon className="w-3 h-3" />
                                        <span>{createdDate}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Bottone elimina */}
                            <Tooltip content="Elimina account" color="danger">
                                <Button
                                    isIconOnly
                                    color="danger"
                                    variant="flat"
                                    size="sm"
                                    onPress={onOpen}
                                    isDisabled={isDeleting}
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </Button>
                            </Tooltip>
                        </div>

                        {/* Saldo */}
                        <div className={`p-3 rounded-lg ${balanceBgColor}`}>
                            <p className="text-xs text-default-600 mb-1">Saldo corrente</p>
                            <p className={`text-2xl font-bold ${balanceColor}`}>
                                {account.currentBalance.toLocaleString("it-IT", {
                                    style: "currency",
                                    currency: account.currency || "EUR",
                                })}
                            </p>
                        </div>
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
                                        Sei sicuro di voler eliminare l'account{" "}
                                        <strong className="text-foreground">"{account.accountName}"</strong>?
                                    </p>

                                    {/* Preview dell'account da eliminare */}
                                    <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg space-y-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <WalletIcon className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-semibold">{account.accountName}</p>
                                                <p className="text-xs text-default-500">{createdDate}</p>
                                            </div>
                                        </div>
                                        <div className="pl-13">
                                            <p className="text-sm text-default-600">Saldo corrente:</p>
                                            <p className="text-xl font-bold text-danger">
                                                {account.currentBalance.toLocaleString("it-IT", {
                                                    style: "currency",
                                                    currency: account.currency || "EUR",
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-warning-50 border border-warning-200 rounded-lg p-3">
                                        <p className="text-sm text-warning-700">
                                            ⚠️ Verranno eliminate anche tutte le transazioni associate a questo account.
                                        </p>
                                    </div>

                                    <p className="text-sm text-danger font-medium">Questa azione non può essere annullata.</p>
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
                                    startContent={!isDeleting && <TrashIcon className="w-4 h-4" />}
                                >
                                    Elimina Account
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}