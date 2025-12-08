"use client";
import { Combobox } from "@/app/v1/components/ui/combobox";
import { Input } from "@/app/v1/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/app/v1/components/ui/select";
import React, { Dispatch, SetStateAction, use, useEffect } from "react";
import { Label } from "@/app/v1/components/ui/label";
import { DateTimePicker } from "../../../_pages/DateTimePicker";
import { SingleCombobox } from "@/app/v1/components/ui/single-combobox";
import { Textarea } from "@/app/v1/components/ui/textarea";
export default function GeneralSection({
  form,
  setForm,
  handleChange,
  userOptions,
  jobsiteOptions,
  costCodeOptions,
  workTypeOptions,
  users,
  jobsites,
}: {
  form: {
    date: Date;
    user: {
      id: string;
      firstName: string;
      lastName: string;
    };
    jobsite: {
      id: string;
      name: string;
    };
    costcode: {
      id: string;
      name: string;
    };
    startTime: Date | null;
    endTime: Date | null;
    workType: string;
    comments: string;
  };
  setForm: Dispatch<
    SetStateAction<{
      date: Date;
      user: {
        id: string;
        firstName: string;
        lastName: string;
      };
      jobsite: {
        id: string;
        name: string;
      };
      costcode: {
        id: string;
        name: string;
      };
      startTime: Date | null;
      endTime: Date | null;
      workType: string;
      comments: string;
    }>
  >;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  userOptions: { value: string; label: string }[];
  jobsiteOptions: { value: string; label: string }[];
  costCodeOptions: { value: string; label: string }[];
  workTypeOptions: { value: string; label: string }[];
  users: { id: string; firstName: string; lastName: string }[];
  jobsites: { id: string; name: string }[];
}) {
  return (
    <>
      {/* User */}
      <div className="w-full">
        <SingleCombobox
          label="User"
          options={userOptions}
          value={form.user.id}
          onChange={(val, option) => {
            const selected = users.find((u) => u.id === val);
            setForm({
              ...form,
              user: selected || {
                id: "",
                firstName: "",
                lastName: "",
              },
            });
          }}
          placeholder="Select user"
          filterKeys={["value", "label"]}
        />
      </div>
      {/* Jobsite */}
      <div className="w-full">
        <SingleCombobox
          label="Jobsite"
          options={jobsiteOptions}
          value={form.jobsite.id}
          onChange={(val, option) => {
            const selected = jobsites.find((j) => j.id === val);
            setForm({
              ...form,
              jobsite: selected || { id: "", name: "" },
              costcode: { id: "", name: "" },
            });
          }}
          placeholder="Select jobsite"
          filterKeys={["value", "label"]}
        />
      </div>
      {/* Costcode */}
      <div className="w-full">
        <SingleCombobox
          label="Cost Code"
          options={costCodeOptions}
          value={form.costcode.id}
          onChange={(val, option) => {
            setForm({
              ...form,
              costcode: option
                ? { id: option.value, name: option.label }
                : { id: "", name: "" },
            });
          }}
          placeholder="Select cost code"
          filterKeys={["value", "label"]}
          disabled={!form.jobsite.id}
        />
        {!form.jobsite.id && (
          <p className="text-xs text-red-600 mt-1">
            Please select a jobsite first to see relevant cost codes.
          </p>
        )}
      </div>
      {/* Start Date & Time */}
      <div className="mb-2">
        <DateTimePicker
          label="Start Time"
          value={form.startTime ? form.startTime.toISOString() : undefined}
          onChange={(val) => {
            setForm({
              ...form,
              startTime: val ? new Date(val) : null,
            });
          }}
        />
      </div>
      <div className="mb-2">
        {/* End Date & Time */}
        <DateTimePicker
          label="End Time"
          value={form.endTime ? form.endTime.toISOString() : undefined}
          onChange={(val) => {
            setForm({
              ...form,
              endTime: val ? new Date(val) : null,
            });
          }}
        />
      </div>
      {/* Comments */}
      <div className="w-full mb-2">
        <label className="block font-semibold text-sm mb-1">
          Comments <span className="text-red-600">*</span>
        </label>
        <Textarea
          value={form.comments}
          onChange={(e) => setForm({ ...form, comments: e.target.value })}
          placeholder="Enter comments"
        />
      </div>
      {/* work type */}
      <div className="w-full mb-2">
        <label className="block font-semibold text-sm mb-1">
          Work Type <span className="text-red-600">*</span>
        </label>
        <Select
          value={form.workType}
          onValueChange={(val) => setForm({ ...form, workType: val })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select work type" />
          </SelectTrigger>
          <SelectContent>
            {workTypeOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
