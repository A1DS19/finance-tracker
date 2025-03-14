import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "./ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { DatePicker } from "./common/datepicker";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { getCategories } from "@/data/get-categories";

type TransactionFormProps = {
  categories: Awaited<ReturnType<typeof getCategories>>; // or for drizzle specific (typeof categoriesTable.$inferSelect)[]
};

const transactionFormSchema = z.object({
  type: z.enum(["income", "expense"]),
  categoryId: z.coerce.number().positive("Select a category"),
  date: z.date().max(new Date(), "Date cannot be in the future"),
  amount: z.coerce.number().positive("Amount is required"),
  description: z
    .string()
    .min(3, "At least 3 characters")
    .max(300, "Max 300 characters"),
});

export function TransactionForm({ categories }: TransactionFormProps) {
  const form = useForm<z.infer<typeof transactionFormSchema>>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      type: "income",
      categoryId: 0,
      date: new Date(),
      amount: 0,
      description: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const handleSubmit = (data: z.infer<typeof transactionFormSchema>) => {
    console.log(data);
  };

  const filteredCategories = categories.filter(
    (category) => category.type === form.watch("type"),
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <fieldset
          className="grid grid-cols-2 gap-y-5 gap-x-2"
          disabled={isSubmitting}
        >
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Transaction type</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Transaction type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value.toString()}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredCategories.map((category) => {
                          return (
                            <SelectItem
                              key={category.id}
                              value={category.id.toString()}
                            >
                              {category.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field: { value, onChange } }) => {
              return (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <DatePicker value={value} onChange={onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} step={0.01} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </fieldset>

        <fieldset disabled={isSubmitting} className="mt-5 flex flex-col gap-5">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <Button type="submit" className="cursor-pointer">
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </fieldset>
      </form>
    </Form>
  );
}
