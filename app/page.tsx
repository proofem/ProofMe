import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Upload, Verified, Zap, Globe, Lock, ArrowRight, Check } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-white" />
            <span className="text-2xl font-bold text-white">ProofMe</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-300 hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How It Works</Link>
            <Link href="/verify" className="text-gray-300 hover:text-white transition-colors">Verify Content</Link>
            <Link href="/dashboard">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Launch App
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
            Prove Your
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {" "}Digital Content
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Authenticate and protect your digital creations with blockchain-powered proof of ownership. 
            Prevent forgery and establish unbreakable content provenance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg">
                Start Protecting Content
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/verify">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg">
                Verify Content
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Powerful Web3 Authentication</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Advanced blockchain technology meets intuitive design for ultimate content protection
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="glass-effect border-white/10 text-white">
            <CardHeader>
              <Shield className="h-12 w-12 text-purple-400 mb-4" />
              <CardTitle>Blockchain Proof</CardTitle>
              <CardDescription className="text-gray-300">
                Every upload creates an immutable record on the ICP blockchain with timestamped ownership proof.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="glass-effect border-white/10 text-white">
            <CardHeader>
              <Verified className="h-12 w-12 text-green-400 mb-4" />
              <CardTitle>Identity Verification</CardTitle>
              <CardDescription className="text-gray-300">
                Live selfie verification and DID integration ensure authentic content ownership claims.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="glass-effect border-white/10 text-white">
            <CardHeader>
              <Zap className="h-12 w-12 text-yellow-400 mb-4" />
              <CardTitle>Instant Verification</CardTitle>
              <CardDescription className="text-gray-300">
                Fast hash-based content verification with real-time authenticity checking via our API.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="glass-effect border-white/10 text-white">
            <CardHeader>
              <Globe className="h-12 w-12 text-blue-400 mb-4" />
              <CardTitle>Web3 Integration</CardTitle>
              <CardDescription className="text-gray-300">
                Connect with MetaMask, Plug Wallet, and other Web3 wallets for seamless authentication.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="glass-effect border-white/10 text-white">
            <CardHeader>
              <Upload className="h-12 w-12 text-purple-400 mb-4" />
              <CardTitle>Multi-Format Support</CardTitle>
              <CardDescription className="text-gray-300">
                Upload images, videos, documents, and certificates with automatic hash fingerprinting.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="glass-effect border-white/10 text-white">
            <CardHeader>
              <Lock className="h-12 w-12 text-red-400 mb-4" />
              <CardTitle>Developer API</CardTitle>
              <CardDescription className="text-gray-300">
                REST API for third-party integration with Figma, Adobe, and other creative platforms.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">How ProofMe Works</h2>
          <p className="text-gray-300 text-lg">Simple steps to authenticate your digital content</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            { step: "1", title: "Connect Wallet", desc: "Link your Web3 wallet and generate your decentralized identity" },
            { step: "2", title: "Upload Content", desc: "Upload your digital files with optional live selfie verification" },
            { step: "3", title: "Generate Proof", desc: "Our system creates SHA-256 hashes and stores them on ICP blockchain" },
            { step: "4", title: "Verify & Share", desc: "Get your authenticity certificate and share verification links" }
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <Card className="glass-effect border-white/10 text-white p-12 text-center">
          <CardHeader>
            <CardTitle className="text-3xl mb-4">Ready to Protect Your Content?</CardTitle>
            <CardDescription className="text-gray-300 text-lg mb-8">
              Join thousands of creators securing their digital assets with blockchain technology
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 text-lg">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Shield className="h-6 w-6 text-white" />
            <span className="text-xl font-bold text-white">ProofMe</span>
          </div>
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms</Link>
            <Link href="/api-docs" className="text-gray-400 hover:text-white transition-colors">API Docs</Link>
          </div>
        </div>
        <div className="text-center text-gray-400 mt-8">
          © 2025 ProofMe. Powered by ICP Blockchain.
        </div>
      </footer>
    </div>
  );
}