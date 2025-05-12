
import React from "react";
import { Link } from "react-router-dom";
import { Mail, AlertCircle, CheckCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const EmailConfirmation = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Mail className="h-16 w-16 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Confirme seu email</h1>
          <p className="text-gray-600">
            Enviamos um link de confirmação para o seu email. Por favor, verifique sua caixa de entrada e clique no link para ativar sua conta.
          </p>
        </div>

        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>O que fazer agora?</AlertTitle>
          <AlertDescription>
            1. Abra sua caixa de entrada de email
            <br />
            2. Procure por um email de confirmação
            <br />
            3. Clique no link "Confirmar email"
            <br />
            4. Você será redirecionado para nossa plataforma
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Não recebeu o email?</AlertTitle>
            <AlertDescription>
              Verifique sua pasta de spam ou lixo eletrônico. Se ainda não encontrar, você pode solicitar um novo email de confirmação.
            </AlertDescription>
          </Alert>

          <div className="flex flex-col gap-3">
            <Button className="w-full">
              Reenviar email de confirmação
            </Button>
            <Button variant="outline" asChild>
              <Link to="/" className="w-full">
                Voltar para página inicial
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-600">
        <p>Se você continuar tendo problemas, entre em contato com nosso suporte.</p>
      </div>
    </div>
  );
};

export default EmailConfirmation;
