/**
 * @fileoverview Advertise Modal Component
 *
 * A modal component for the Advertise feature that displays a contact form.
 * Features a background blur effect and professional styling matching the
 * platform's design system.
 *
 * @author Embedded Frontend Team
 * @version 1.0.0
 */

import React, { useState, useEffect, useCallback } from "react";
import "./AdvertiseModal.css";

type Payload = { name: string; email: string; message: string };

export async function sendContactEmail(payload: Payload) {
  const r = await fetch("/api/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data?.error || "Failed");
  return data;
}

interface AdvertiseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * AdvertiseModal Component
 *
 * Renders a modal with a contact form for advertising inquiries.
 * Includes backdrop blur effect and form validation.
 *
 * @param isOpen - Controls the visibility of the modal
 * @param onClose - Callback function to close the modal
 * @returns JSX element representing the advertise modal
 */
const AdvertiseModal: React.FC<AdvertiseModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  type Status =
    | { type: "idle" }
    | { type: "success"; message: string }
    | { type: "error"; message: string };
  const [status, setStatus] = useState<Status>({ type: "idle" });

  // Handle escape key to close modal
  const handleEscapeKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleEscapeKey]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "idle" });
    try {
      await sendContactEmail(formData);
      setFormData({ name: "", email: "", message: "" });
      setStatus({
        type: "success",
        message: "Message sent successfully! We'll get back to you soon.",
      });
    } catch (err: any) {
      setStatus({
        type: "error",
        message: err?.message || "Failed to send email",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="advertise-modal__overlay"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="advertise-modal-title"
    >
      <div className="advertise-modal">
        {/* Close Button */}
        <button
          className="advertise-modal__close"
          onClick={onClose}
          aria-label="Close modal"
          type="button"
        >
          ×
        </button>

        {/* Icon */}
        <div className="advertise-modal__icon">
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10h5v-2h-5c-4.34 0-8-3.66-8-8s3.66-8 8-8 8 3.66 8 8v1.43c0 .79-.71 1.57-1.5 1.57s-1.5-.78-1.5-1.57V12c0-2.76-2.24-5-5-5s-5 2.24-5 5 2.24 5 5 5c1.38 0 2.64-.56 3.54-1.47.65.89 1.77 1.47 2.96 1.47 1.97 0 3.5-1.6 3.5-3.57V12c0-5.52-4.48-10-10-10zm0 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"
              fill="#5dd62c"
            />
          </svg>
        </div>

        {/* Title */}
        <h2 id="advertise-modal-title" className="advertise-modal__title">
          Get in contact with us
        </h2>

        {/* Description */}
        <p className="advertise-modal__description">
          Have questions about partnerships or advertising, or just want to say
          hi? Send us a message and we'll get back to you as soon as possible.
        </p>

        {/* Form */}
        <form className="advertise-modal__form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            className="advertise-modal__input"
            required
            aria-label="Your name"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="advertise-modal__input"
            required
            aria-label="Your email"
          />

          <textarea
            name="message"
            placeholder="Message"
            value={formData.message}
            onChange={handleInputChange}
            className="advertise-modal__textarea"
            required
            aria-label="Your message"
          />

          <button
            type="submit"
            className="advertise-modal__submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send"}
          </button>

          {status.type === "success" && (
            <div className="advertise-modal__status advertise-modal__status--success">
              {status.message}
            </div>
          )}
          {status.type === "error" && (
            <div className="advertise-modal__status advertise-modal__status--error">
              {status.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdvertiseModal;
