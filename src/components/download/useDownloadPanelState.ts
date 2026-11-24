"use client";

import { useEffect, useState, type RefObject } from "react";
import type { CpuArchitecture } from "@/lib/downloadCatalog";
import type { LinuxFamilyId, PackageChannel } from "@/lib/linuxPackages";

export function useDownloadPanelState(isOpen: boolean, dialogRef: RefObject<HTMLDialogElement | null>) {
  const [arch, setArch] = useState<CpuArchitecture>("x86_64");
  const [family, setFamily] = useState<LinuxFamilyId>("debian");
  const [channel, setChannel] = useState<PackageChannel>("stable");
  const [copied, setCopied] = useState("");
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent || "";
    if (/\b(aarch64|arm64|armv8|woa|snapdragon)\b/i.test(ua)) {
      queueMicrotask(() => setArch("arm64"));
      return;
    }
    const uaData = (
      navigator as Navigator & {
        userAgentData?: { getHighEntropyValues?: (hints: string[]) => Promise<{ architecture?: string }> };
      }
    ).userAgentData;
    uaData
      ?.getHighEntropyValues?.(["architecture"])
      .then((v) => v?.architecture && /arm/i.test(v.architecture) && setArch("arm64"))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen, dialogRef]);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previous;
    };
  }, [isOpen]);

  const copy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(key);
      window.setTimeout(() => setCopied((c) => (c === key ? "" : c)), 2000);
    });
  };

  return {
    arch, setArch,
    family, setFamily,
    channel, setChannel,
    copied, copy,
    showMoreOptions,
    toggleMoreOptions: () => setShowMoreOptions((v) => !v),
  };
}
