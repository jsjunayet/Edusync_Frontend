import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Item {
  id: string;
  [key: string]: string;
}

interface FormSchema {
  [key: string]: string;
}

interface FieldMeta {
  name: string;
  type: "text" | "select";
  options?: string[];
}

interface Props {
  title: string;
  subtitle?: string;
  formFieldMeta: FieldMeta[];
  fetchItems: () => Promise<Item[]>;
  createItem: (data: FormSchema) => Promise<void>;
  updateItem: (id: string, data: FormSchema) => Promise<void>;
  deleteItem?: (id: string) => Promise<void>;
}

const ReusableCRUDPage: React.FC<Props> = ({
  title,
  subtitle = "Interactive real-time schedule management",
  formFieldMeta,
  fetchItems,
  createItem,
  updateItem,
  deleteItem,
}) => {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<FormSchema>({});
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    setItems(fetchItems);
  }, [fetchItems]);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    if (editId) {
      await updateItem(editId, formData);
    } else {
      await createItem(formData);
    }
    setOpenDialog(false);
    setFormData({});
    setEditId(null);
  };

  const handleEdit = (item: Item) => {
    setFormData({ ...item });
    setEditId(item._id);
    setOpenDialog(true);
  };

  const filtered = items?.filter((item) =>
    Object.values(item).some((value) =>
      value.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <Button
          onClick={() => setOpenDialog(true)}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add {title.split(" ")[0]}
        </Button>
      </div>

      <Input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Table>
        <TableHeader>
          <TableRow>
            {formFieldMeta.map((field) => (
              <TableHead key={field.name}>{field.name}</TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered?.map((item) => (
            <TableRow key={item.id}>
              {formFieldMeta.map((field) => (
                <TableCell key={field.name}>{item[field.name]}</TableCell>
              ))}
              <TableCell className="space-x-2">
                <Button size="sm" onClick={() => handleEdit(item)}>
                  <Pencil size={16} />
                </Button>
                {/* <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteItem && deleteItem(item.id)}
                >
                  <Trash2 size={16} />
                </Button> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editId ? "Update" : "Create"} {title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {formFieldMeta.map((field) => (
              <div key={field.name}>
                {field.type === "select" ? (
                  <select
                    value={formData[field.name] || ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full border px-3 py-2 rounded-md"
                  >
                    <option value="">Select {field.name}</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    placeholder={field.name}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                  />
                )}
              </div>
            ))}
            <Button onClick={handleSubmit}>
              {editId ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReusableCRUDPage;
