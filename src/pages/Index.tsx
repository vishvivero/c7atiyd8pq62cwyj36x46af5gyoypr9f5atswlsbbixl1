import Header from "@/components/Header";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import { CookieConsent } from "@/components/legal/CookieConsent";
import { LegalFooter } from "@/components/legal/LegalFooter";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <Separator className="my-4 bg-gray-100" />
      <FeaturesSection />
      <Separator className="my-4 bg-gray-100" />
      <footer className="bg-gray-50 py-12 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Debtfreeo</h3>
              <p className="text-gray-600">
                Your journey to financial freedom starts here.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2 text-gray-600">
                <li>Features</li>
                <li>Pricing</li>
                <li>Enterprise</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-gray-600">
                <li>About Us</li>
                <li>Careers</li>
                <li>Blog</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <LegalFooter />
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
            <p>&copy; 2024 Debtfreeo. All rights reserved.</p>
          </div>
        </div>
      </footer>
      <CookieConsent />
    </div>
  );
};

export default Index;