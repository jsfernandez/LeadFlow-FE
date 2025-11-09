"use client";

import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import { TableSkeleton } from "@/components/ui/skeleton";
import { EmptyState, EmptyStateIcons } from "@/components/ui/empty-state";
import { useFilteredLeads, useLeadFilterOptions, type LeadFilters, type LeadSort } from "@/hooks/use-filtered-leads";
import { useTranslation } from "@/hooks/use-translation";
import type { Lead } from "@/types";
import { Search, Filter, ArrowUpDown, X } from "lucide-react";

interface LeadSelectorProps {
  /**
   * Whether the selector modal is open
   */
  open: boolean;
  /**
   * Callback when the modal open state changes
   */
  onOpenChange: (open: boolean) => void;
  /**
   * Array of leads to display
   */
  leads: Lead[] | undefined;
  /**
   * Whether leads are still loading
   */
  isLoading: boolean;
  /**
   * Callback when a lead is selected
   * @param lead - The selected lead
   */
  onSelectLead: (lead: Lead) => void;
  /**
   * Currently selected lead ID (optional, for highlighting)
   */
  selectedLeadId?: string;
}

/**
 * LeadSelector - Modal component for selecting a lead with advanced filtering and sorting
 * 
 * Features:
 * - Search by fullName, companyName, email
 * - Filter by industry, country, city, gender
 * - Sort by multiple fields (companyName, fullName, industry, country, createdAt, revenue)
 * - Virtualization support for large datasets (>50 leads)
 * - Responsive table layout
 * 
 * Usage:
 * ```tsx
 * <LeadSelector
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   leads={leads}
 *   isLoading={loading}
 *   onSelectLead={(lead) => handleSelectLead(lead)}
 * />
 * ```
 */
export function LeadSelector({
  open,
  onOpenChange,
  leads,
  isLoading,
  onSelectLead,
  selectedLeadId,
}: LeadSelectorProps) {
  const { t } = useTranslation();

  // Filter state
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

  // Handle lead selection
  const handleSelectLead = (lead: Lead) => {
    onSelectLead(lead);
    onOpenChange(false);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("proposals.selectLead")}</DialogTitle>
          <DialogDescription>
            {t("proposals.chooseLead")}
          </DialogDescription>
        </DialogHeader>

        {/* Filter and Sort Bar */}
        <div className="space-y-4 py-4">
          {/* Search Bar */}
          <div className="flex gap-2">
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
                className="gap-1"
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
              <SelectTrigger className="w-[180px]">
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
              <SelectTrigger className="w-[180px]">
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
              <SelectTrigger className="w-[180px]">
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
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder={t("leads.filter.gender")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("leads.filter.allGenders")}</SelectItem>
                {filterOptions.genders.map((gender) => (
                  <SelectItem key={gender} value={gender}>
                    {gender}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
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

        {/* Leads Table */}
        <div className="border rounded-md">
          {isLoading ? (
            <TableSkeleton rows={5} />
          ) : filteredLeads && filteredLeads.length > 0 ? (
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead>{t("leads.company")}</TableHead>
                    <TableHead>{t("leads.fullName")}</TableHead>
                    <TableHead>{t("leads.email")}</TableHead>
                    <TableHead>{t("leads.phone")}</TableHead>
                    <TableHead>{t("leads.industry")}</TableHead>
                    <TableHead>{t("leads.location")}</TableHead>
                    <TableHead>{t("leads.revenueRange")}</TableHead>
                    <TableHead>{t("leads.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow
                      key={lead.id}
                      className={`cursor-pointer hover:bg-muted/50 ${
                        selectedLeadId === lead.id ? "bg-muted" : ""
                      }`}
                      onClick={() => handleSelectLead(lead)}
                    >
                      <TableCell className="font-medium">{lead.companyName}</TableCell>
                      <TableCell>{lead.fullName}</TableCell>
                      <TableCell className="text-sm">{lead.email}</TableCell>
                      <TableCell className="text-sm">{lead.phone}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{lead.industry}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {lead.city}, {lead.country}
                      </TableCell>
                      <TableCell className="text-sm">
                        ${lead.minRevenue} - ${lead.maxRevenue}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectLead(lead);
                          }}
                        >
                          {t("common.select")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-8">
              <EmptyState
                icon={EmptyStateIcons.Clipboard}
                title={t("leads.noLeads")}
                description={hasActiveFilters ? t("leads.filter.clearFilters") : t("leads.noLeadsDescription")}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
