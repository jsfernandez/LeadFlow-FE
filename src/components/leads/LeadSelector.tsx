"use client";

import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
   * Callback when leads are selected
   * @param leads - The selected leads array
   */
  onSelectLeads: (leads: Lead[]) => void;
  /**
   * Currently selected lead IDs (optional, for highlighting)
   */
  selectedLeadIds?: string[];
}

/**
 * LeadSelector - Modal component for selecting multiple leads with advanced filtering and sorting
 * 
 * Features:
 * - Multi-select with checkboxes
 * - Search by fullName, companyName, email
 * - Filter by industry, country, city, gender
 * - Sort by multiple fields (companyName, fullName, industry, country, createdAt, revenue)
 * - Selections persist across pagination and filters
 * - Responsive table layout
 * 
 * Usage:
 * ```tsx
 * <LeadSelector
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   leads={leads}
 *   isLoading={loading}
 *   onSelectLeads={(leads) => handleSelectLeads(leads)}
 *   selectedLeadIds={selectedIds}
 * />
 * ```
 */
export function LeadSelector({
  open,
  onOpenChange,
  leads,
  isLoading,
  onSelectLeads,
  selectedLeadIds = [],
}: LeadSelectorProps) {
  const { t } = useTranslation();
  
  // Local state for selected lead IDs (preserves selections across filters/pagination)
  const [localSelectedIds, setLocalSelectedIds] = useState<string[]>(selectedLeadIds);

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

  // Toggle single lead selection
  const toggleLead = (leadId: string) => {
    setLocalSelectedIds((prev) => {
      if (prev.includes(leadId)) {
        return prev.filter((id) => id !== leadId);
      } else {
        return [...prev, leadId];
      }
    });
  };

  // Toggle all visible leads
  const toggleAll = () => {
    if (!filteredLeads) return;
    
    const visibleLeadIds = filteredLeads.map((lead) => lead.id);
    const allVisibleSelected = visibleLeadIds.every((id) => localSelectedIds.includes(id));
    
    if (allVisibleSelected) {
      // Deselect all visible leads
      setLocalSelectedIds((prev) => prev.filter((id) => !visibleLeadIds.includes(id)));
    } else {
      // Select all visible leads (merge with existing selections)
      setLocalSelectedIds((prev) => {
        const newIds = visibleLeadIds.filter((id) => !prev.includes(id));
        return [...prev, ...newIds];
      });
    }
  };

  // Check if all visible leads are selected
  const allVisibleSelected = useMemo(() => {
    if (!filteredLeads || filteredLeads.length === 0) return false;
    return filteredLeads.every((lead) => localSelectedIds.includes(lead.id));
  }, [filteredLeads, localSelectedIds]);

  // Check if some (but not all) visible leads are selected
  const someVisibleSelected = useMemo(() => {
    if (!filteredLeads || filteredLeads.length === 0) return false;
    return filteredLeads.some((lead) => localSelectedIds.includes(lead.id)) && !allVisibleSelected;
  }, [filteredLeads, localSelectedIds, allVisibleSelected]);

  // Handle confirm selection
  const handleConfirmSelection = () => {
    if (!leads) return;
    const selectedLeads = leads.filter((lead) => localSelectedIds.includes(lead.id));
    onSelectLeads(selectedLeads);
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
                    <TableHead className="w-12">
                      <Checkbox
                        checked={allVisibleSelected}
                        onCheckedChange={toggleAll}
                        aria-label={allVisibleSelected ? t("proposals.selectLeadModal.clearAll") : t("proposals.selectLeadModal.selectAll")}
                        className={someVisibleSelected ? "data-[state=checked]:bg-primary/50" : ""}
                      />
                    </TableHead>
                    <TableHead>{t("leads.company")}</TableHead>
                    <TableHead>{t("leads.fullName")}</TableHead>
                    <TableHead>{t("leads.email")}</TableHead>
                    <TableHead>{t("leads.phone")}</TableHead>
                    <TableHead>{t("leads.industry")}</TableHead>
                    <TableHead>{t("leads.location")}</TableHead>
                    <TableHead>{t("leads.revenueRange")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow
                      key={lead.id}
                      className={`cursor-pointer hover:bg-muted/50 ${
                        localSelectedIds.includes(lead.id) ? "bg-muted" : ""
                      }`}
                      onClick={() => toggleLead(lead.id)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={localSelectedIds.includes(lead.id)}
                          onCheckedChange={() => toggleLead(lead.id)}
                          aria-label={`Select ${lead.companyName}`}
                        />
                      </TableCell>
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

        {/* Bottom Action Bar */}
        <DialogFooter className="flex flex-col sm:flex-row gap-2 items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {localSelectedIds.length > 0
              ? `${localSelectedIds.length} ${localSelectedIds.length === 1 ? "lead" : "leads"} selected`
              : t("proposals.selectLeadModal.noneSelected")}
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 sm:flex-none"
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleConfirmSelection}
              disabled={localSelectedIds.length === 0}
              className="flex-1 sm:flex-none"
            >
              {localSelectedIds.length > 0
                ? t("proposals.selectLeadModal.confirmSelection").replace("{count}", localSelectedIds.length.toString())
                : t("common.select")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
