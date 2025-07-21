"use client";
import React, { useState } from "react";
import { Dialog } from "@headlessui/react";

export default function CreateCommunityModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: "", description: "" });
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/40" />

        <div className="relative bg-white p-8 w-full max-w-md">
          <Dialog.Title className="text-2xl font-bold text-black mb-6">
            Create New Community
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Community Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 text-black border border-neutral-200 focus:border-black transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2 text-black border border-neutral-200 focus:border-black transition-colors"
                rows={4}
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-black transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium bg-black text-white hover:bg-neutral-900 transition-colors">
                Create Community
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}
