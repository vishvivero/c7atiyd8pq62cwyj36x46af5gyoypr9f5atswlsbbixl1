import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MainLayout } from "@/components/layout/MainLayout";
import { useProfile } from "@/hooks/use-profile";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { AccountInfoCard } from "@/components/profile/AccountInfoCard";
import { DisplayPreferences } from "@/components/profile/DisplayPreferences";

export default function Profile() {
  const { user, signOut } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleCurrencyChange = async (currency: string) => {
    try {
      setIsUpdating(true);
      await updateProfile.mutateAsync({
        preferred_currency: currency
      });
      toast({
        title: "Currency Updated",
        description: "Your preferred currency has been updated successfully."
      });
    } catch (error) {
      console.error("Error updating currency:", error);
      toast({
        title: "Error",
        description: "Failed to update currency preference",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleChange = async (key: string, value: boolean) => {
    console.log(`Toggle ${key} changed to:`, value);
    toast({
      title: "Preference Updated",
      description: `${key} preference has been updated.`
    });
  };

  const handleResetData = async () => {
    try {
      setIsUpdating(true);
      await supabase.from('debts').delete().eq('user_id', user?.id);
      await supabase.from('payment_history').delete().eq('user_id', user?.id);
      await supabase.from('one_time_funding').delete().eq('user_id', user?.id);
      
      queryClient.invalidateQueries();
      
      toast({
        title: "Data Reset",
        description: "All your data has been successfully reset."
      });
    } catch (error) {
      console.error("Error resetting data:", error);
      toast({
        title: "Error",
        description: "Failed to reset data",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsUpdating(true);
      await handleResetData();
      await supabase.from('profiles').delete().eq('id', user?.id);
      await signOut();
      
      toast({
        title: "Account Deleted",
        description: "Your account has been successfully deleted."
      });
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <Badge variant="secondary">Personal</Badge>
        </div>
        <p className="text-muted-foreground mb-8">
          Manage your account settings and preferences
        </p>

        <div className="grid gap-6">
          <AccountInfoCard />
          
          <DisplayPreferences
            preferredCurrency={profile?.preferred_currency || "GBP"}
            onCurrencyChange={handleCurrencyChange}
            onToggleChange={handleToggleChange}
            isUpdating={isUpdating}
          />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="h-5 w-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Reset Account Data</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  All user-entered data will be deleted, but your account will remain active.
                </p>
                <Button 
                  variant="outline" 
                  className="text-destructive border-destructive hover:bg-destructive/10"
                  onClick={handleResetData}
                  disabled={isUpdating}
                >
                  Reset Data
                </Button>
              </div>

              <div>
                <h3 className="font-medium mb-1">Delete Account</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  This action cannot be undone. Your account and all associated data will be permanently deleted.
                </p>
                <Button 
                  variant="outline" 
                  className="text-destructive border-destructive hover:bg-destructive/10"
                  onClick={handleDeleteAccount}
                  disabled={isUpdating}
                >
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}