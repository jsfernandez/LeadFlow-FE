"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useTranslation } from "@/hooks/use-translation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { dataProvider } from "@/lib/dataProvider";
import { updateProfileSchema, type UpdateProfileInput } from "@/lib/schemas/profile.schema";

/**
 * Profile page component
 * Allows users to view and edit their account information
 * Available to SELLER and LEAD_MANAGER roles
 */
export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileInput>({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    city: "",
    country: "",
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
      });
    }
  }, [user]);

  const handleInputChange = (field: keyof UpdateProfileInput, value: string) => {
    setFormData((prev) => ({
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
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder={t("profile.phonePlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">{t("profile.company")}</Label>
              <Input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                placeholder={t("profile.companyPlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">{t("profile.address")}</Label>
              <Input
                id="address"
                type="text"
                value={formData.address}
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
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder={t("profile.cityPlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">{t("profile.country")}</Label>
                <Input
                  id="country"
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  placeholder={t("profile.countryPlaceholder")}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t("common.loading") : t("profile.saveChanges")}
          </Button>
        </div>
      </form>
    </div>
  );
}
