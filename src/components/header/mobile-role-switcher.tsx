import { Role, useAuth } from "@/contexts/AuthContext";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export const MobileRoleSwitcher = () => {
    const { role, setRole } = useAuth();
    return (
      <div className="p-4 mt-auto border-t">
        <Label className="text-xs font-medium text-muted-foreground">Mô phỏng vai trò</Label>
        <Select value={role} onValueChange={(value) => setRole(value as Role)}>
          <SelectTrigger className="w-full mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="candidate-full-profile">Đã đăng nhập (Profile full)</SelectItem>
            <SelectItem value="candidate">Đã đăng nhập (Có Profile)</SelectItem>
            <SelectItem value="candidate-empty-profile">Đã đăng nhập (Profile trắng)</SelectItem>
            <SelectItem value="guest">Khách (Chưa đăng nhập)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  }