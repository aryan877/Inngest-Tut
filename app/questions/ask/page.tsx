"use client";

import { ImageUpload } from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AskQuestionFormData } from "@/lib/types";
import { askQuestionSchema } from "@/lib/validations/question";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function AskQuestionPage() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AskQuestionFormData>({
    resolver: zodResolver(askQuestionSchema),
    defaultValues: {
      title: "",
      body: "",
      images: [],
    },
  });

  const onSubmit = async (formData: AskQuestionFormData) => {
    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          body: formData.body,
          images: formData.images,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create question");
      }

      const data = await res.json();
      router.push(`/questions/${data.data.id}`);
    } catch (error) {
      console.error("Error creating question:", error);
      alert("Failed to create question. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-heading text-3xl font-bold mb-2 text-foreground">
        Ask a Public Question
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        Get instant AI-powered answers and community insights
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="title">
            Title<span className="text-red-500 ml-1">*</span>
          </Label>
          <p className="text-sm text-muted-foreground mb-2">
            Be specific and imagine you're asking a question to another person
          </p>
          <Input
            id="title"
            placeholder="e.g., How do I use useState in React?"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="body">
            Body<span className="text-red-500 ml-1">*</span>
          </Label>
          <p className="text-sm text-muted-foreground mb-2">
            Include all the information someone would need to answer your
            question
          </p>
          <Textarea
            id="body"
            placeholder="Describe your problem in detail... (Markdown supported)"
            className="min-h-[300px]"
            {...register("body")}
          />
          {errors.body && (
            <p className="text-sm text-red-500 mt-1">{errors.body.message}</p>
          )}
        </div>

        <div>
          <Label>Images (Optional)</Label>
          <p className="text-sm text-muted-foreground mb-2">
            Add up to 4 images to help illustrate your question
          </p>
          <ImageUpload
            maxImages={4}
            onImagesChange={(newImages) => {
              setImages(newImages);
              setValue("images", newImages);
            }}
            existingImages={images}
          />
        </div>

        <div className="bg-card p-4 border border-border rounded">
          <h3 className="font-semibold mb-2 text-card-foreground">
            What happens next?
          </h3>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Your question will be posted immediately</li>
            <li>• AI will automatically generate tags</li>
            <li>• You'll receive an AI-generated answer within 30 seconds</li>
            <li>• Community members can also provide additional answers</li>
          </ul>
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            {isSubmitting ? "Submitting..." : "Submit Question"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
