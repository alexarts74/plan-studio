"use client";

import { type FormEvent } from "react";

export default function ContactForm() {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement)
      .value;

    const subject = encodeURIComponent(`Contact — ${name}`);
    const body = encodeURIComponent(
      `De : ${name}\nEmail : ${email}\n\n${message}`,
    );
    window.location.href = `mailto:contact.studioplan@gmail.com?subject=${subject}&body=${body}`;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <label htmlFor="name" className="block text-sm text-gray-500 mb-2">
          Nom
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full border-b border-gray-300 bg-transparent py-3 text-foreground outline-none transition-colors focus:border-foreground"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm text-gray-500 mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full border-b border-gray-300 bg-transparent py-3 text-foreground outline-none transition-colors focus:border-foreground"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm text-gray-500 mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full border-b border-gray-300 bg-transparent py-3 text-foreground outline-none transition-colors focus:border-foreground resize-none"
        />
      </div>
      <button
        type="submit"
        className="border border-foreground px-8 py-3 text-sm tracking-widest uppercase transition-colors hover:bg-foreground hover:text-background"
      >
        Envoyer
      </button>
    </form>
  );
}
