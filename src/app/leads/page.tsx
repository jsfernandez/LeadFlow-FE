"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MoneyInput } from "@/components/ui/money-input";
import { TableSkeleton } from "@/components/ui/skeleton";
import { formatCurrencyCLP } from "@/lib/utils";
import { EmptyState, EmptyStateIcons } from "@/components/ui/empty-state";
import { useLeads, useCreateLead, useUpdateLead, useDeleteLead } from "@/hooks/use-leads";
import { useFilteredLeads, useLeadFilterOptions, type LeadFilters, type LeadSort } from "@/hooks/use-filtered-leads";
import { useAuth } from "@/components/providers/auth-provider";
import type { Lead } from "@/types";
import { useTranslation } from "@/hooks/use-translation";
import { Search, Filter, ArrowUpDown, X } from "lucide-react";

export default function LeadsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: leads, isLoading, error } = useLeads();
  const createLead = useCreateLead();
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    leadId: "",
    email: "",
    phone: "",
    companyName: "",
    title: "",
    country: "",
    city: "",
    industry: "",
    profileUrl: "",
    positionCode: "",
    gender: "",
    minRevenue: 0,
    maxRevenue: 0,
  });
  
  const [formErrors, setFormErrors] = useState<{
    minRevenue?: string;
    maxRevenue?: string;
  }>({});

  // Filter and sort state
  const [filters, setFilters] = useState<LeadFilters>({
    search: "",
    industry: "all",
    country: "all",
    city: "all",
    gender: "all",
  });

  // Sort state - default to createdAt DESC
  const [sort, setSort] = useState<LeadSort>({
    field: "createdAt",
    direction: "desc",
  });

  // Get filter options from leads
  const filterOptions = useLeadFilterOptions(leads);

  // Apply filters and sorting
  const filteredLeads = useFilteredLeads(leads, filters, sort);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.search !== "" ||
      filters.industry !== "all" ||
      filters.country !== "all" ||
      filters.city !== "all" ||
      filters.gender !== "all"
    );
  }, [filters]);

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      search: "",
      industry: "all",
      country: "all",
      city: "all",
      gender: "all",
    });
  };

  // Toggle sort direction or change sort field
  const handleSort = (field: LeadSort["field"]) => {
    setSort((prev) => {
      if (prev.field === field) {
        // Toggle direction if same field
        return { field, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      // Default to ascending for new field
      return { field, direction: "asc" };
    });
  };

  const validateForm = () => {
    const errors: { minRevenue?: string; maxRevenue?: string } = {};
    const minRev = Number(formData.minRevenue);
    const maxRev = Number(formData.maxRevenue);

    if (minRev > maxRev) {
      errors.minRevenue = t("form.errors.minGreaterThanMax");
      errors.maxRevenue = t("form.errors.maxLessThanMin");
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!validateForm()) {
      return;
    }

    try {
      // Sanitize profileUrl
      const sanitizedProfileUrl = formData.profileUrl.trim();
      
      await createLead.mutateAsync({
        ...formData,
        profileUrl: sanitizedProfileUrl,
        minRevenue: Number(formData.minRevenue),
        maxRevenue: Number(formData.maxRevenue),
      });
      
      // Reset form and close dialog
      setFormData({
        fullName: "",
        leadId: "",
        email: "",
        phone: "",
        companyName: "",
        title: "",
        country: "",
        city: "",
        industry: "",
        profileUrl: "",
        positionCode: "",
        gender: "",
        minRevenue: 0,
        maxRevenue: 0,
      });
      setFormErrors({});
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Failed to create lead:", error);
    }
  };

  const handleUpdateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;

    if (!validateForm()) {
      return;
    }

    try {
      // Sanitize profileUrl
      const sanitizedProfileUrl = formData.profileUrl.trim();
      
      await updateLead.mutateAsync({
        id: selectedLead.id,
        data: {
          ...formData,
          profileUrl: sanitizedProfileUrl,
          minRevenue: Number(formData.minRevenue),
          maxRevenue: Number(formData.maxRevenue),
        },
      });
      
      setIsEditDialogOpen(false);
      setSelectedLead(null);
      setFormErrors({});
    } catch (error) {
      console.error("Failed to update lead:", error);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm(t("leads.confirmDelete"))) return;
    
    try {
      await deleteLead.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete lead:", error);
    }
  };

  const openEditDialog = (lead: Lead) => {
    setSelectedLead(lead);
    setFormData({
      fullName: lead.fullName,
      leadId: lead.leadId,
      email: lead.email,
      phone: lead.phone,
      companyName: lead.companyName,
      title: lead.title,
      country: lead.country,
      city: lead.city,
      industry: lead.industry,
      profileUrl: lead.profileUrl || "",
      positionCode: lead.positionCode || "",
      gender: lead.gender || "",
      minRevenue: lead.minRevenue,
      maxRevenue: lead.maxRevenue,
    });
    setFormErrors({});
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{t("leads.title")}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">{t("leads.subtitle")}</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="w-full sm:w-auto">
          {t("leads.createLead")}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("leads.allLeads")}</CardTitle>
          <CardDescription>{t("leads.listDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filter and Sort Bar */}
          <div className="space-y-4 mb-6">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("leads.filter.searchPlaceholder")}
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-9"
                />
              </div>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  className="gap-1 w-full sm:w-auto"
                >
                  <X className="h-4 w-4" />
                  {t("leads.filter.clearFilters")}
                </Button>
              )}
            </div>

            {/* Filters and Sort */}
            <div className="flex flex-wrap gap-2">
              {/* Industry Filter */}
              <Select
                value={filters.industry}
                onValueChange={(value) => setFilters({ ...filters, industry: value })}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={t("leads.filter.industry")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("leads.filter.allIndustries")}</SelectItem>
                  {filterOptions.industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Country Filter */}
              <Select
                value={filters.country}
                onValueChange={(value) => setFilters({ ...filters, country: value })}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={t("leads.filter.country")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("leads.filter.allCountries")}</SelectItem>
                  {filterOptions.countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* City Filter */}
              <Select
                value={filters.city}
                onValueChange={(value) => setFilters({ ...filters, city: value })}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={t("leads.filter.city")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("leads.filter.allCities")}</SelectItem>
                  {filterOptions.cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Gender Filter */}
              <Select
                value={filters.gender}
                onValueChange={(value) => setFilters({ ...filters, gender: value })}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={t("leads.filter.gender")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("leads.filter.allGenders")}</SelectItem>
                  {filterOptions.genders.map((gender) => (
                    <SelectItem key={gender} value={gender}>
                      {gender === "MALE" ? t("leads.genderMale") : gender === "FEMALE" ? t("leads.genderFemale") : gender === "OTHER" ? t("leads.genderOther") : gender}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-1 w-full sm:w-auto">
                    <ArrowUpDown className="h-4 w-4" />
                    {t("leads.sort.sortBy")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>{t("leads.sort.sortBy")}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleSort("companyName")}>
                    {t("leads.sort.companyName")}
                    {sort.field === "companyName" && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {sort.direction === "asc" ? "↑" : "↓"}
                      </Badge>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort("fullName")}>
                    {t("leads.sort.fullName")}
                    {sort.field === "fullName" && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {sort.direction === "asc" ? "↑" : "↓"}
                      </Badge>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort("industry")}>
                    {t("leads.sort.industry")}
                    {sort.field === "industry" && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {sort.direction === "asc" ? "↑" : "↓"}
                      </Badge>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort("country")}>
                    {t("leads.sort.country")}
                    {sort.field === "country" && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {sort.direction === "asc" ? "↑" : "↓"}
                      </Badge>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort("createdAt")}>
                    {t("leads.sort.createdAt")}
                    {sort.field === "createdAt" && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {sort.direction === "asc" ? "↑" : "↓"}
                      </Badge>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort("minRevenue")}>
                    {t("leads.sort.minRevenue")}
                    {sort.field === "minRevenue" && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {sort.direction === "asc" ? "↑" : "↓"}
                      </Badge>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort("maxRevenue")}>
                    {t("leads.sort.maxRevenue")}
                    {sort.field === "maxRevenue" && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {sort.direction === "asc" ? "↑" : "↓"}
                      </Badge>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Results count */}
            {!isLoading && filteredLeads && (
              <p className="text-sm text-muted-foreground">
                {filteredLeads.length} {filteredLeads.length === 1 ? "lead" : "leads"}
              </p>
            )}
          </div>

          {isLoading ? (
            <TableSkeleton rows={5} />
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-sm text-red-400">{t("leads.failedToLoad")}</p>
            </div>
          ) : filteredLeads && filteredLeads.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">{t("leads.company")}</TableHead>
                    <TableHead className="min-w-[150px]">{t("leads.fullName")}</TableHead>
                    <TableHead className="min-w-[180px]">{t("leads.email")}</TableHead>
                    <TableHead className="min-w-[120px]">{t("leads.phone")}</TableHead>
                    <TableHead className="min-w-[150px]">{t("leads.location")}</TableHead>
                    <TableHead className="min-w-[120px]">{t("leads.industry")}</TableHead>
                    <TableHead className="min-w-[180px]">{t("leads.compensationRange")}</TableHead>
                    <TableHead className="min-w-[150px]">{t("leads.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium text-sm md:text-base">{lead.companyName}</TableCell>
                      <TableCell className="text-sm md:text-base">{lead.fullName}</TableCell>
                      <TableCell className="text-sm md:text-base">{lead.email}</TableCell>
                      <TableCell className="text-sm md:text-base">{lead.phone}</TableCell>
                      <TableCell className="text-sm md:text-base whitespace-nowrap">{`${lead.city}, ${lead.country}`}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs md:text-sm">{lead.industry}</Badge>
                      </TableCell>
                      <TableCell className="text-sm md:text-base whitespace-nowrap">
                        {formatCurrencyCLP(lead.minRevenue)} - {formatCurrencyCLP(lead.maxRevenue)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(lead)}
                          >
                            {t("common.edit")}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteLead(lead.id)}
                          >
                            {t("common.delete")}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <EmptyState
              icon={EmptyStateIcons.Clipboard}
              title={t("leads.noLeads")}
              description={hasActiveFilters ? t("leads.filter.clearFilters") : t("leads.noLeadsDescription")}
              action={
                !hasActiveFilters
                  ? {
                      label: t("leads.createLead"),
                      onClick: () => setIsCreateDialogOpen(true),
                    }
                  : undefined
              }
            />
          )}
        </CardContent>
      </Card>

      {/* Create Lead Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleCreateLead}>
            <DialogHeader>
              <DialogTitle>{t("leads.createLead")}</DialogTitle>
              <DialogDescription>
                {t("leads.createLeadDescription")}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t("leads.fullName")} *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leadId">{t("leads.identityDocument")} *</Label>
                  <Input
                    id="leadId"
                    value={formData.leadId}
                    onChange={(e) => setFormData({ ...formData, leadId: e.target.value })}
                    placeholder={t("leads.identityDocumentPlaceholder")}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t("leads.email")} *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("leads.phone")} *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">{t("leads.company")} *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">{t("leads.academicDegree")} *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder={t("leads.academicDegreePlaceholder")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="positionCode">{t("leads.position")}</Label>
                  <Input
                    id="positionCode"
                    value={formData.positionCode}
                    onChange={(e) => setFormData({ ...formData, positionCode: e.target.value })}
                    placeholder={t("leads.positionPlaceholder")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">{t("leads.country")} *</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">{t("leads.city")} *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">{t("leads.industry")} *</Label>
                  <Input
                    id="industry"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">{t("leads.gender")}</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder={t("leads.gender")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">{t("leads.genderMale")}</SelectItem>
                      <SelectItem value="FEMALE">{t("leads.genderFemale")}</SelectItem>
                      <SelectItem value="OTHER">{t("leads.genderOther")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minRevenue">{t("leads.minCompensation")} (CLP) *</Label>
                  <MoneyInput
                    id="minRevenue"
                    value={formData.minRevenue}
                    onChange={(value) => {
                      setFormData({ ...formData, minRevenue: value });
                      if (formErrors.minRevenue) setFormErrors({ ...formErrors, minRevenue: undefined });
                    }}
                    required
                  />
                  {formErrors.minRevenue && (
                    <p className="text-sm text-red-500">{formErrors.minRevenue}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxRevenue">{t("leads.maxCompensation")} (CLP) *</Label>
                  <MoneyInput
                    id="maxRevenue"
                    value={formData.maxRevenue}
                    onChange={(value) => {
                      setFormData({ ...formData, maxRevenue: value });
                      if (formErrors.maxRevenue) setFormErrors({ ...formErrors, maxRevenue: undefined });
                    }}
                    required
                  />
                  {formErrors.maxRevenue && (
                    <p className="text-sm text-red-500">{formErrors.maxRevenue}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profileUrl">{t("leads.profileUrl")}</Label>
                <Input
                  id="profileUrl"
                  value={formData.profileUrl}
                  onChange={(e) => setFormData({ ...formData, profileUrl: e.target.value })}
                  placeholder={t("leads.profileUrlPlaceholder")}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsCreateDialogOpen(false)}
                disabled={createLead.isPending}
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={createLead.isPending}
              >
                {createLead.isPending ? t("leads.creating") : t("common.create")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Lead Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleUpdateLead}>
            <DialogHeader>
              <DialogTitle>{t("leads.editLead")}</DialogTitle>
              <DialogDescription>
                {t("leads.editLeadDescription")}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-fullName">{t("leads.fullName")} *</Label>
                  <Input
                    id="edit-fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-leadId">{t("leads.identityDocument")} *</Label>
                  <Input
                    id="edit-leadId"
                    value={formData.leadId}
                    onChange={(e) => setFormData({ ...formData, leadId: e.target.value })}
                    placeholder={t("leads.identityDocumentPlaceholder")}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-email">{t("leads.email")} *</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">{t("leads.phone")} *</Label>
                  <Input
                    id="edit-phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-companyName">{t("leads.company")} *</Label>
                <Input
                  id="edit-companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">{t("leads.academicDegree")} *</Label>
                  <Input
                    id="edit-title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder={t("leads.academicDegreePlaceholder")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-positionCode">{t("leads.position")}</Label>
                  <Input
                    id="edit-positionCode"
                    value={formData.positionCode}
                    onChange={(e) => setFormData({ ...formData, positionCode: e.target.value })}
                    placeholder={t("leads.positionPlaceholder")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-country">{t("leads.country")} *</Label>
                  <Input
                    id="edit-country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-city">{t("leads.city")} *</Label>
                  <Input
                    id="edit-city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-industry">{t("leads.industry")} *</Label>
                  <Input
                    id="edit-industry"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-gender">{t("leads.gender")}</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  >
                    <SelectTrigger id="edit-gender">
                      <SelectValue placeholder={t("leads.gender")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">{t("leads.genderMale")}</SelectItem>
                      <SelectItem value="FEMALE">{t("leads.genderFemale")}</SelectItem>
                      <SelectItem value="OTHER">{t("leads.genderOther")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-minRevenue">{t("leads.minCompensation")} (CLP) *</Label>
                  <MoneyInput
                    id="edit-minRevenue"
                    value={formData.minRevenue}
                    onChange={(value) => {
                      setFormData({ ...formData, minRevenue: value });
                      if (formErrors.minRevenue) setFormErrors({ ...formErrors, minRevenue: undefined });
                    }}
                    required
                  />
                  {formErrors.minRevenue && (
                    <p className="text-sm text-red-500">{formErrors.minRevenue}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-maxRevenue">{t("leads.maxCompensation")} (CLP) *</Label>
                  <MoneyInput
                    id="edit-maxRevenue"
                    value={formData.maxRevenue}
                    onChange={(value) => {
                      setFormData({ ...formData, maxRevenue: value });
                      if (formErrors.maxRevenue) setFormErrors({ ...formErrors, maxRevenue: undefined });
                    }}
                    required
                  />
                  {formErrors.maxRevenue && (
                    <p className="text-sm text-red-500">{formErrors.maxRevenue}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-profileUrl">{t("leads.profileUrl")}</Label>
                <Input
                  id="edit-profileUrl"
                  value={formData.profileUrl}
                  onChange={(e) => setFormData({ ...formData, profileUrl: e.target.value })}
                  placeholder={t("leads.profileUrlPlaceholder")}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setSelectedLead(null);
                }}
                disabled={updateLead.isPending}
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={updateLead.isPending}
              >
                {updateLead.isPending ? t("leads.updating") : t("common.save")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
