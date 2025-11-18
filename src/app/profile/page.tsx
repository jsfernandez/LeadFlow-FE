"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useTranslation } from "@/hooks/use-translation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { dataProvider } from "@/lib/dataProvider";
import { 
  updateProfileSchema, 
  type UpdateProfileInput,
  changePasswordSchema,
  type ChangePasswordInput
} from "@/lib/schemas/profile.schema";
import type { BillingType } from "@/types";

/**
 * Profile page component
 * Allows users to view and edit their account information
 * Available to SELLER and LEAD_MANAGER roles
 */
export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileInput>({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    city: "",
    country: "",
    billingType: undefined,
    bio: "",
    professionalDescription: "",
  });
  const [passwordData, setPasswordData] = useState<ChangePasswordInput>({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        company: user.company || "",
        address: user.address || "",
        city: user.city || "",
        country: user.country || "",
        billingType: user.billingType,
        bio: user.bio || "",
        professionalDescription: user.professionalDescription || "",
      });
    }
  }, [user]);

  const handleInputChange = (field: keyof UpdateProfileInput, value: string | BillingType | undefined) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = (field: keyof ChangePasswordInput, value: string) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsSubmitting(true);

    try {
      // Validate form data
      const validatedData = updateProfileSchema.parse(formData);

      // Update user profile via data provider
      const updatedUser = await dataProvider.updateUser(user.id, validatedData);

      if (updatedUser) {
        // Update local auth context
        updateUser(updatedUser);
        toast.success(t("profile.updateSuccess"));
      } else {
        toast.error(t("profile.updateError"));
      }
    } catch (error) {
      console.error("Profile update error:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(t("profile.updateError"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsChangingPassword(true);

    try {
      // Validate password data
      const validatedData = changePasswordSchema.parse(passwordData);

      // Change password via data provider
      const success = await dataProvider.changePassword(
        user.id,
        validatedData.currentPassword,
        validatedData.newPassword
      );

      if (success) {
        toast.success(t("profile.passwordChangeSuccess"));
        // Clear password fields
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } else {
        toast.error(t("profile.passwordChangeError"));
      }
    } catch (error) {
      console.error("Password change error:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(t("profile.passwordChangeError"));
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">{t("profile.title")}</h1>
        <p className="text-sm sm:text-base text-muted-foreground">{t("profile.subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t("profile.personalInfo")}</CardTitle>
            <CardDescription>{t("profile.personalInfoDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("profile.name")}</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder={t("profile.namePlaceholder")}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("profile.email")}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder={t("profile.emailPlaceholder")}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t("profile.contactInfo")}</CardTitle>
            <CardDescription>{t("profile.contactInfoDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">{t("profile.phone")}</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone || ""}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder={t("profile.phonePlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">{t("profile.company")}</Label>
              <Input
                id="company"
                type="text"
                value={formData.company || ""}
                onChange={(e) => handleInputChange("company", e.target.value)}
                placeholder={t("profile.companyPlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">{t("profile.address")}</Label>
              <Input
                id="address"
                type="text"
                value={formData.address || ""}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder={t("profile.addressPlaceholder")}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">{t("profile.city")}</Label>
                <Input
                  id="city"
                  type="text"
                  value={formData.city || ""}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder={t("profile.cityPlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">{t("profile.country")}</Label>
                <Input
                  id="country"
                  type="text"
                  value={formData.country || ""}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  placeholder={t("profile.countryPlaceholder")}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t("profile.accountInfo")}</CardTitle>
            <CardDescription>{t("profile.accountInfoDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t("profile.accountType")}</Label>
              <Input
                type="text"
                value={t(`users.roles.${user.role}`)}
                disabled
                className="bg-muted"
              />
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t("profile.additionalInfo")}</CardTitle>
            <CardDescription>{t("profile.additionalInfoDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bio">{t("profile.bio")}</Label>
              <Textarea
                id="bio"
                value={formData.bio || ""}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder={t("profile.bioPlaceholder")}
                maxLength={500}
                rows={4}
              />
              <p className="text-sm text-muted-foreground">
                {formData.bio?.length || 0}/500
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="professionalDescription">{t("profile.professionalDescription")}</Label>
              <Textarea
                id="professionalDescription"
                value={formData.professionalDescription || ""}
                onChange={(e) => handleInputChange("professionalDescription", e.target.value)}
                placeholder={t("profile.professionalDescriptionPlaceholder")}
                maxLength={500}
                rows={4}
              />
              <p className="text-sm text-muted-foreground">
                {formData.professionalDescription?.length || 0}/500
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Billing Preference */}
        {(user.role === "SELLER" || user.role === "LEAD_MANAGER") && (
          <Card>
            <CardHeader>
              <CardTitle>{t("profile.billingInfo")}</CardTitle>
              <CardDescription>{t("profile.billingInfoDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>{t("profile.billingTypeQuestion")}</Label>
                <RadioGroup
                  value={formData.billingType || ""}
                  onValueChange={(value) => handleInputChange("billingType", value as BillingType)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="BOLETA" id="boleta" />
                    <Label htmlFor="boleta" className="font-normal cursor-pointer">
                      {t("profile.boleta")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="FACTURA" id="factura" />
                    <Label htmlFor="factura" className="font-normal cursor-pointer">
                      {t("profile.factura")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="AMBOS" id="ambos" />
                    <Label htmlFor="ambos" className="font-normal cursor-pointer">
                      {t("profile.ambos")}
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t("common.loading") : t("profile.saveChanges")}
          </Button>
        </div>
      </form>

      <Separator className="my-8" />

      {/* Password Management */}
      <form onSubmit={handlePasswordSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("profile.passwordManagement")}</CardTitle>
            <CardDescription>{t("profile.passwordManagementDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">{t("profile.currentPassword")}</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                placeholder={t("profile.currentPasswordPlaceholder")}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">{t("profile.newPassword")}</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                placeholder={t("profile.newPasswordPlaceholder")}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmNewPassword">{t("profile.confirmNewPassword")}</Label>
              <Input
                id="confirmNewPassword"
                type="password"
                value={passwordData.confirmNewPassword}
                onChange={(e) => handlePasswordChange("confirmNewPassword", e.target.value)}
                placeholder={t("profile.confirmNewPasswordPlaceholder")}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Change Password Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isChangingPassword} variant="secondary">
            {isChangingPassword ? t("common.loading") : t("profile.changePassword")}
          </Button>
        </div>
      </form>
    </div>
  );
}
