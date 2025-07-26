"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Shield, Search, CheckCircle, XCircle, User, Calendar, FileText, Copy, ExternalLink, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface VerificationResult {
  isValid: boolean;
  contentHash: string;
  ownerAddress: string;
  timestamp: string;
  fileName: string;
  fileType: string;
  did: string;
  blockchainTxn: string;
}

export default function VerifyPage() {
  const [hashInput, setHashInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleVerification = async () => {
    if (!hashInput.trim()) {
      toast({
        title: "Missing Hash",
        description: "Please enter a content hash to verify",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    setShowResult(false);

    // Simulate API call
    setTimeout(() => {
      // Mock verification result
      const mockResult: VerificationResult = {
        isValid: Math.random() > 0.3, // 70% chance of valid
        contentHash: hashInput,
        ownerAddress: "0x742d35Cc6A22E5C5Db4c3A2B88a4C29E7E4D8E9F",
        timestamp: "2025-01-09T10:30:00Z",
        fileName: "artwork_final.jpg",
        fileType: "image/jpeg",
        did: "did:icp:bkyz2-fmaaa-aaaah-qaaaq-cai",
        blockchainTxn: "0x8f3b2c1a9e7d6f5c4b3a2e1d9c8b7a6f5e4d3c2b1a"
      };

      setVerificationResult(mockResult);
      setIsVerifying(false);
      setShowResult(true);

      toast({
        title: mockResult.isValid ? "Content Verified!" : "Verification Failed",
        description: mockResult.isValid 
          ? "Content authenticity confirmed on blockchain" 
          : "Content hash not found in our database",
        variant: mockResult.isValid ? "default" : "destructive",
      });
    }, 2000);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-white" />
            <span className="text-2xl font-bold text-white">ProofMe</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
                <Search className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Verify Content Authenticity</h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Enter a content hash to verify its authenticity and ownership on the blockchain
            </p>
          </div>

          {/* Verification Form */}
          <Card className="glass-effect border-white/10 text-white mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Content Hash Verification</CardTitle>
              <CardDescription className="text-gray-300">
                Paste the SHA-256 hash of the content you want to verify
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="hash-input" className="text-white">Content Hash</Label>
                <Input
                  id="hash-input"
                  type="text"
                  placeholder="Enter SHA-256 content hash (e.g., a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2)"
                  value={hashInput}
                  onChange={(e) => setHashInput(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              
              <Button 
                onClick={handleVerification}
                disabled={isVerifying}
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isVerifying ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Verify Content
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Verification Results */}
          {showResult && verificationResult && (
            <Card className="glass-effect border-white/10 text-white">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  {verificationResult.isValid ? (
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  ) : (
                    <XCircle className="h-8 w-8 text-red-400" />
                  )}
                  <div>
                    <CardTitle className="text-2xl">
                      {verificationResult.isValid ? "Content Verified ✓" : "Verification Failed"}
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      {verificationResult.isValid 
                        ? "This content is authentic and ownership has been verified"
                        : "This content hash was not found in our blockchain records"
                      }
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              {verificationResult.isValid && (
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium">File Name</p>
                            <p className="text-sm text-gray-400">{verificationResult.fileName}</p>
                          </div>
                        </div>
                        <Badge className="bg-green-600">Verified</Badge>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <User className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium">Owner Address</p>
                            <p className="text-sm text-gray-400 font-mono">
                              {verificationResult.ownerAddress.slice(0, 10)}...{verificationResult.ownerAddress.slice(-8)}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(verificationResult.ownerAddress, "Owner address")}
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium">Upload Date</p>
                            <p className="text-sm text-gray-400">
                              {new Date(verificationResult.timestamp).toLocaleDateString()} at {new Date(verificationResult.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">Content Hash</p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(verificationResult.contentHash, "Content hash")}
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <code className="text-xs text-gray-300 break-all bg-black/20 p-2 rounded block">
                          {verificationResult.contentHash}
                        </code>
                      </div>

                      <div className="p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">Decentralized ID</p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(verificationResult.did, "DID")}
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <code className="text-xs text-gray-300 break-all bg-black/20 p-2 rounded block">
                          {verificationResult.did}
                        </code>
                      </div>

                      <div className="p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">Blockchain Transaction</p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(verificationResult.blockchainTxn, "Transaction hash")}
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                        <code className="text-xs text-gray-300 break-all bg-black/20 p-2 rounded block">
                          {verificationResult.blockchainTxn}
                        </code>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10">
                    <Button
                      onClick={() => copyToClipboard(window.location.href, "Verification link")}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Share Verification Link
                    </Button>
                    <Button
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Download Certificate
                    </Button>
                  </div>
                </CardContent>
              )}
              
              {!verificationResult.isValid && (
                <CardContent>
                  <div className="text-center py-8">
                    <AlertTriangle className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Content Not Found</h3>
                    <p className="text-gray-300 mb-6 max-w-md mx-auto">
                      The provided hash doesn't match any content in our blockchain database. 
                      This could mean the content was never authenticated through ProofMe.
                    </p>
                    <Link href="/dashboard">
                      <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                        Authenticate Your Content
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              )}
            </Card>
          )}

          {/* How to Use */}
          <Card className="glass-effect border-white/10 text-white mt-8">
            <CardHeader>
              <CardTitle>How to Get Content Hash</CardTitle>
              <CardDescription className="text-gray-300">
                Learn how to obtain the content hash for verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">From ProofMe Dashboard</h3>
                  <p className="text-sm text-gray-300">Copy the hash from your authenticated content in the dashboard</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">From Certificate</h3>
                  <p className="text-sm text-gray-300">Use the hash provided in your authenticity certificate</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">From Verification Link</h3>
                  <p className="text-sm text-gray-300">Hash is included in shared verification links</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}