"use client";

import React, { useState } from "react";
import axios from "axios";
import { FileUpload } from "@/components/FileUpload";
import { PreviewStats } from "@/components/PreviewStats";
import { EmailValidator } from "@/components/EmailValidator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface PreviewStatsInterface {
  totalEmails: number;
  totalRows: number;
  totalEmptyEmails: number;
  totalDuplicateEmails: number;
  columnName: string;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [emailColumnIndex, setEmailColumnIndex] = useState<string>("");
  const [removeEmptyEmails, setRemoveEmptyEmails] = useState<boolean>(false);
  const [previewStats, setPreviewStats] =
    useState<PreviewStatsInterface | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");
  const [processedFilename, setProcessedFilename] = useState<string>("");
  const [showValidator, setShowValidator] = useState<boolean>(false);
  const [validatorKey, setValidatorKey] = useState<number>(0);

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
      setError("Please upload a CSV file");
      return;
    }

    setFile(selectedFile);
    setPreviewStats(null);
    setError("");
    setSuccess("");
    setProcessedFilename("");
    setShowValidator(false);
  };

  const validateEmailColumnIndex = (index: string) => {
    const parsed = parseInt(index);
    if (isNaN(parsed) || parsed < 0) {
      setError("Email column index must be a non-negative number");
      return false;
    }
    return true;
  };

  const handleEmailColumnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmailColumnIndex(value);
    if (value && !validateEmailColumnIndex(value)) {
      return;
    }
    setError("");
  };

  const startEmailValidation = (filename: string, columnIndex: string) => {
    if (!validateEmailColumnIndex(columnIndex)) return;

    setProcessedFilename(filename);
    setEmailColumnIndex(columnIndex);
    setValidatorKey((prev) => prev + 1);
    setShowValidator(true);
  };

  const handlePreview = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    if (!emailColumnIndex || !validateEmailColumnIndex(emailColumnIndex)) {
      setError("Please enter a valid email column index");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("emailColumnIndex", emailColumnIndex);

    try {
      const response = await axios.post(
        "https://csv-api-xnlp.onrender.com/csv-processor/preview",
        formData
      );
      setPreviewStats(response.data.stats);
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Failed to preview file. Please try again."
      );
      setPreviewStats(null);
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    if (!emailColumnIndex || !validateEmailColumnIndex(emailColumnIndex)) {
      setError("Please enter a valid email column index");
      return;
    }

    setLoading(true);
    setError("");
    setShowValidator(false);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("emailColumnIndex", emailColumnIndex);
    formData.append("removeEmptyEmails", removeEmptyEmails.toString());

    try {
      const response = await axios.post(
        "https://csv-api-xnlp.onrender.com/csv-processor/process",
        formData
      );
      setSuccess("File processed successfully!");
      setProcessedFilename(response.data.filename);
      setShowValidator(true);
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Failed to process file. Please try again."
      );
      setShowValidator(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <main className="container mx-auto p-4 max-w-4xl">
        <Card className="bg-white shadow-lg">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-2xl font-bold text-gray-800">
              CSV Email Processor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Step 1: Upload CSV File
                </h3>
                <FileUpload onFileSelect={handleFileSelect} />
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Step 2: Configure Processing
                </h3>
                <div className="space-y-4">
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="emailColumn" className="text-gray-700">
                      Email Column Index
                    </Label>
                    <Input
                      type="number"
                      id="emailColumn"
                      value={emailColumnIndex}
                      onChange={(e) => setEmailColumnIndex(e.target.value)}
                      placeholder="Enter column number (0-based)"
                      min="0"
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="removeEmpty"
                      checked={removeEmptyEmails}
                      onCheckedChange={(checked) =>
                        setRemoveEmptyEmails(checked as boolean)
                      }
                    />
                    <Label
                      htmlFor="removeEmpty"
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      Remove rows with empty emails
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 border-green-200">
                <AlertTitle className="text-green-800">Success</AlertTitle>
                <AlertDescription className="text-green-700">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            {previewStats && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  File Preview
                </h3>
                <PreviewStats stats={previewStats} />
              </div>
            )}

            <div className="flex gap-4">
              <Button
                onClick={handlePreview}
                disabled={loading || !file || !emailColumnIndex}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Preview
              </Button>

              <Button
                onClick={handleProcess}
                disabled={loading || !file || !emailColumnIndex}
                variant="secondary"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Process File
              </Button>
            </div>

            {showValidator && processedFilename && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Step 3: Email Validation
                </h3>
                <EmailValidator
                  filename={processedFilename}
                  emailColumnIndex={emailColumnIndex}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
