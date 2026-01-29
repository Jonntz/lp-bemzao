"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BadgeCheck, MessageCircle } from "lucide-react";

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const WHATSAPP_LINK = "https://chat.whatsapp.com/CGyPoxRigK6KF2HgC7E1Rf";

export function SuccessModal({ isOpen, onClose }: SuccessModalProps) {

    const handleWhatsAppRedirect = () => {
        window.open(WHATSAPP_LINK, "_blank");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md text-center">
                <DialogHeader className="flex flex-col items-center gap-2">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                        <BadgeCheck className="h-6 w-6 text-green-600" />
                    </div>
                    <DialogTitle className="text-2xl font-bold text-gray-900">Cadastro Confirmado! 🎉</DialogTitle>
                    <DialogDescription className="text-base">
                        Obrigado por se inscrever. Para garantir que você não perca nenhuma novidade, entre agora na nossa comunidade exclusiva.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="sm:justify-center flex-col gap-2 mt-4">
                    <Button
                        className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold h-12 text-lg shadow-md transition-all"
                        onClick={handleWhatsAppRedirect}
                    >
                        Entrar na Comunidade VIP
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}