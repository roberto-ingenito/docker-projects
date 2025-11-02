"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchAccounts, createAccount, deleteAccount } from "@/lib/redux/slices/accountsSlice";
import { AccountCreateDto } from "@/lib/types/account";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { useDisclosure } from "@heroui/use-disclosure";
import { Spinner } from "@heroui/spinner";

import { PlusIcon, WalletIcon, SparklesIcon } from "@heroicons/react/24/solid";
import AccountCard from "./(components)/accountCard";

export default function AccountsPage() {
  const dispatch = useAppDispatch();

  const accounts = useAppSelector((state) => state.accounts.accounts);
  const isLoading = useAppSelector((state) => state.accounts.isLoading);
  const error = useAppSelector((state) => state.accounts.error);
  const firstLoadDone = useAppSelector((state) => state.accounts.firstLoadDone);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<AccountCreateDto>({
    accountName: "",
    initialBalance: 0,
  });

  useEffect(() => {
    if (!firstLoadDone) dispatch(fetchAccounts());
  }, []);

  const handleCreateAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(createAccount(formData));
    if (result.meta.requestStatus === "fulfilled") {
      setFormData({
        accountName: "",
        initialBalance: 0,
      });
      onOpenChange();
    }
  };

  const handleDelete = async (accountId: number) => {
    setDeletingId(accountId);
    await dispatch(deleteAccount(accountId));
    setDeletingId(null);
  };

  // Calcola il totale di tutti gli account
  const totalBalance = accounts.reduce((sum, account) => sum + account.currentBalance, 0);

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-primary bg-clip-text text-transparent">I Tuoi Conti</h1>
          <p className="text-default-500 mt-2">Gestisci i tuoi conti e portafogli</p>
        </div>
        <Button color="primary" size="lg" startContent={<PlusIcon className="w-5 h-5" />} onPress={onOpen} className="w-full sm:w-auto font-semibold">
          Nuovo Conto
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

      {/* Riepilogo Totale */}
      {accounts.length > 0 && (
        <Card className="mb-6 bg-primary-100 border-2 border-primary-400">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-default-600 font-medium mb-1">Bilancio Totale</p>
                <p className="text-3xl font-bold text-primary">
                  {totalBalance.toLocaleString("it-IT", {
                    style: "currency",
                    currency: accounts[0]?.currency || "EUR",
                  })}
                </p>
              </div>
              <div className="w-16 h-16 rounded-full bg-primary/30 flex items-center justify-center">
                <WalletIcon className="w-8 h-8 text-primary-600" />
              </div>
            </div>
            <p className="text-xs text-default-500 mt-2">{accounts.length} conti attivi</p>
          </CardBody>
        </Card>
      )}

      {/* Lista Account */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Spinner size="lg" color="primary" />
            <p className="text-default-500 mt-4">Caricamento account...</p>
          </div>
        ) : accounts.length === 0 ? (
          <Card className="border-2 border-dashed border-default-300">
            <CardBody className="py-20">
              <div className="text-center">
                <WalletIcon className="w-16 h-16 mx-auto text-default-300 mb-4" />
                <h3 className="text-xl font-semibold text-default-600 mb-2">Nessun conto</h3>
                <p className="text-default-500 mb-6">Crea il tuo primo conto per iniziare a tracciare le tue finanze</p>
                <Button color="primary" variant="flat" startContent={<PlusIcon className="w-5 h-5" />} onPress={onOpen}>
                  Nuovo Conto
                </Button>
              </div>
            </CardBody>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-default-600 font-medium">
                {accounts.length} {accounts.length === 1 ? "account" : "account"}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accounts.map((account) => (
                <AccountCard
                  key={account.accountId}
                  account={account}
                  onDelete={() => handleDelete(account.accountId)}
                  isDeleting={deletingId === account.accountId}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal Crea Account */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" scrollBehavior="inside" placement="center" backdrop="blur">
        <ModalContent as="form" onSubmit={handleCreateAccountSubmit}>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold">Crea Nuovo Account</h2>
                <p className="text-sm text-default-500 font-normal">Aggiungi un nuovo conto o portafoglio per tracciare le tue finanze</p>
              </ModalHeader>
              <ModalBody className="gap-6">
                {/* Nome Account */}
                <Input
                  label="Nome Account"
                  placeholder="Es: Conto Corrente, Portafoglio, Carta di Credito..."
                  value={formData.accountName}
                  onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                  isRequired
                  variant="bordered"
                  size="lg"
                  maxLength={100}
                  description="Scegli un nome descrittivo per il tuo account"
                />

                {/* Saldo Iniziale */}
                <Input
                  label="Saldo Iniziale"
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  value={formData.initialBalance.toString()}
                  onChange={(e) => setFormData({ ...formData, initialBalance: parseFloat(e.target.value) || 0 })}
                  variant="bordered"
                  size="lg"
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">€</span>
                    </div>
                  }
                  description="Inserisci il saldo corrente del tuo account"
                />

                {/* Preview */}
                <div>
                  <label className="block text-sm font-medium mb-3">Anteprima</label>
                  <div className="p-4 border-2 border-primary-300 rounded-lg bg-primary-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-lg">{formData.accountName || "Nome Account"}</p>
                        <p className="text-sm text-default-500 mt-1">Saldo corrente</p>
                        <p className="text-2xl font-bold text-primary mt-1">
                          {formData.initialBalance.toLocaleString("it-IT", {
                            style: "currency",
                            currency: "EUR",
                          })}
                        </p>
                      </div>
                      <div className="w-14 h-14 rounded-full bg-primary/30 flex items-center justify-center">
                        <WalletIcon className="w-7 h-7 text-primary-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose} variant="flat">
                  Annulla
                </Button>
                <Button type="submit" color="primary" isLoading={isLoading} startContent={!isLoading && <SparklesIcon className="w-5 h-5" />}>
                  Crea Account
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}