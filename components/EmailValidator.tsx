import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import axios from "axios";

interface EmailValidatorProps {
  filename: string;
  emailColumnIndex: string;
}

export function EmailValidator({
  filename,
  emailColumnIndex,
}: EmailValidatorProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const startValidation = async () => {
    if (loading) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post(
        `https://csv-api-xnlp.onrender.com/email-validator/validate/${filename}`,
        { emailColumnIndex }
      );
      setSuccess("File emails have been validated successfully!");
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "An error occurred while validating emails"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Validation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50">
            <AlertDescription className="text-green-700 font-medium">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {!success && (
          <Button onClick={startValidation} disabled={loading} className="w-40">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Processing..." : "Start Validation"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
