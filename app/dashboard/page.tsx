"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { Shield, Upload, Eye, Camera, FileImage, FileVideo, FileText, Wallet, Copy, ExternalLink, Plus, Verified, Clock, Download } from "lucide-react";
import Link from "next/link";

interface ContentItem {
  id: string;
  fileName: string;
  fileType: string;
  hash: string;
  timestamp: string;
  verified: boolean;
  size: string;
}

export default function Dashboard() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [userContent, setUserContent] = useState<ContentItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [verificationStep, setVerificationStep] = useState<'idle' | 'selfie' | 'processing'>('idle');

  // Mock data for demonstration
  useEffect(() => {
    setUserContent([
      {
        id: "1",
        fileName: "artwork_final.jpg",
        fileType: "image",
        hash: "a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2",
        timestamp: "2025-01-09T10:30:00Z",
        verified: true,
        size: "2.4 MB"
      },
      {
        id: "2", 
        fileName: "certificate.pdf",
        fileType: "document",
        hash: "b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6",
        timestamp: "2025-01-08T15:45:00Z",
        verified: true,
        size: "1.2 MB"
      },
      {
        id: "3",
        fileName: "portfolio_video.mp4",
        fileType: "video", 
        hash: "c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7",
        timestamp: "2025-01-07T09:15:00Z",
        verified: false,
        size: "15.7 MB"
      }
    ]);
  }, []);

  const connectWallet = async () => {
    try {
      // Mock wallet connection
      setWalletAddress("0x742d35Cc6A22E5C5Db4c3A2B88a4C29E7E4D8E9F");
      setIsConnected(true);
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to MetaMask wallet",
      });
    } catch (error) {
      toast({
        title: "Connection Failed", 
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setVerificationStep('selfie');
  };

  const startSelfieVerification = () => {
    // Mock selfie verification process
    setVerificationStep('processing');
    setUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setVerificationStep('idle');
          setSelectedFile(null);
          
          // Add new content to list
          const newContent: ContentItem = {
            id: Date.now().toString(),
            fileName: selectedFile?.name || "unknown.file",
            fileType: selectedFile?.type.startsWith('image/') ? 'image' : 
                     selectedFile?.type.startsWith('video/') ? 'video' : 'document',
            hash: `${Math.random().toString(36).substring(2, 34)}`,
            timestamp: new Date().toISOString(),
            verified: true,
            size: `${(selectedFile?.size || 0 / 1024 / 1024).toFixed(1)} MB`
          };
          
          setUserContent(prev => [newContent, ...prev]);
          
          toast({
            title: "Content Verified!",
            description: "Your content has been successfully authenticated and stored on the blockchain.",
          });
          
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const skipSelfieVerification = () => {
    setVerificationStep('processing');
    setUploading(true);
    startSelfieVerification();
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    toast({
      title: "Hash Copied",
      description: "Content hash copied to clipboard",
    });
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <FileImage className="h-5 w-5" />;
      case 'video': return <FileVideo className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
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
            <Link href="/verify">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Eye className="mr-2 h-4 w-4" />
                Verify Content
              </Button>
            </Link>
            {isConnected ? (
              <div className="flex items-center space-x-2 glass-effect px-4 py-2 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-white text-sm">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              </div>
            ) : (
              <Button onClick={connectWallet} className="bg-gradient-to-r from-purple-600 to-pink-600">
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        {!isConnected ? (
          <Card className="glass-effect border-white/10 text-white max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <Shield className="h-16 w-16 text-purple-400 mx-auto mb-4" />
              <CardTitle className="text-2xl">Connect Your Wallet</CardTitle>
              <CardDescription className="text-gray-300">
                Connect your Web3 wallet to start authenticating your digital content
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={connectWallet} size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600">
                <Wallet className="mr-2 h-5 w-5" />
                Connect MetaMask
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="upload" className="space-y-8">
            <TabsList className="glass-effect border-white/10">
              <TabsTrigger value="upload" className="data-[state=active]:bg-white/10">
                <Upload className="mr-2 h-4 w-4" />
                Upload Content
              </TabsTrigger>
              <TabsTrigger value="content" className="data-[state=active]:bg-white/10">
                <Shield className="mr-2 h-4 w-4" />
                My Content
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload">
              <Card className="glass-effect border-white/10 text-white">
                <CardHeader>
                  <CardTitle className="text-2xl">Upload & Authenticate Content</CardTitle>
                  <CardDescription className="text-gray-300">
                    Upload your digital content to create an immutable proof of ownership on the blockchain
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {verificationStep === 'idle' && (
                    <div className="space-y-6">
                      <div className="border-2 border-dashed border-white/20 rounded-lg p-12 text-center hover:border-white/40 transition-colors">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-lg mb-2">Drop your files here or click to browse</p>
                        <p className="text-gray-400 text-sm mb-4">Supports images, videos, documents, and certificates</p>
                        <Input
                          type="file"
                          onChange={handleFileUpload}
                          accept="image/*,video/*,.pdf,.doc,.docx"
                          className="hidden"
                          id="file-upload"
                        />
                        <Label htmlFor="file-upload">
                          <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                            <Plus className="mr-2 h-4 w-4" />
                            Select File
                          </Button>
                        </Label>
                      </div>
                    </div>
                  )}

                  {verificationStep === 'selfie' && selectedFile && (
                    <div className="space-y-6">
                      <div className="text-center">
                        <Camera className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Identity Verification</h3>
                        <p className="text-gray-300 mb-6">
                          To verify ownership of "{selectedFile.name}", please take a live selfie or skip this step.
                        </p>
                        <div className="flex gap-4 justify-center">
                          <Button onClick={startSelfieVerification} className="bg-gradient-to-r from-purple-600 to-pink-600">
                            <Camera className="mr-2 h-4 w-4" />
                            Take Selfie
                          </Button>
                          <Button onClick={skipSelfieVerification} variant="outline" className="border-white/20 text-white hover:bg-white/10">
                            Skip Verification
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {uploading && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="animate-pulse-slow">
                          <Shield className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Processing Content</h3>
                        <p className="text-gray-300 mb-4">
                          Generating SHA-256 hash and storing proof on ICP blockchain...
                        </p>
                      </div>
                      <Progress value={uploadProgress} className="w-full" />
                      <p className="text-center text-sm text-gray-400">{uploadProgress}% complete</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content">
              <Card className="glass-effect border-white/10 text-white">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center">
                    <Shield className="mr-3 h-6 w-6" />
                    My Authenticated Content
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    View and manage your blockchain-verified digital content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userContent.map((item) => (
                      <Card key={item.id} className="glass-effect border-white/10 text-white">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="p-2 bg-white/10 rounded-lg">
                                {getFileIcon(item.fileType)}
                              </div>
                              <div>
                                <h3 className="font-semibold">{item.fileName}</h3>
                                <p className="text-sm text-gray-400">{item.size} • {new Date(item.timestamp).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Badge variant={item.verified ? "default" : "secondary"} className={item.verified ? "bg-green-600" : "bg-yellow-600"}>
                                {item.verified ? (
                                  <>
                                    <Verified className="mr-1 h-3 w-3" />
                                    Verified
                                  </>
                                ) : (
                                  <>
                                    <Clock className="mr-1 h-3 w-3" />
                                    Pending
                                  </>
                                )}
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyHash(item.hash)}
                                className="border-white/20 text-white hover:bg-white/10"
                              >
                                <Copy className="mr-2 h-3 w-3" />
                                Copy Hash
                              </Button>
                              <Link href={`/verify?hash=${item.hash}`}>
                                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
                                  <ExternalLink className="mr-2 h-3 w-3" />
                                  View Proof
                                </Button>
                              </Link>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-white/10">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Content Hash:</span>
                              <code className="bg-white/10 px-2 py-1 rounded text-xs">{item.hash}</code>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {userContent.length === 0 && (
                      <div className="text-center py-12">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400">No content uploaded yet. Start by uploading your first file!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}