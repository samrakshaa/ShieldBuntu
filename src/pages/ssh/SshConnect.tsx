import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
const SshConnect = () => {
  return (
    <div className="flex flex-col max-w-[900px] px-4 mx-auto items-center">
      {/* <Form> */}
      {/* <FormField
        name="username"
        render={({ field }) => (
          <>
            <FormItem className="">
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>Enter your Ubuntu Username</FormDescription>
              <FormMessage />
            </FormItem>
            <FormItem className="">
              <FormLabel>Ip Address</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                Enter your current IP V4 Address
              </FormDescription>
              <FormMessage />
            </FormItem>
            <FormItem className="">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" {...field} />
              </FormControl>
              <FormDescription>Enter your ubuntu password.</FormDescription>
              <FormMessage />
            </FormItem>
          </>
        )}
      /> */}
      <Button type="submit">Submit</Button>
      {/* </Form> */}
    </div>
  );
};

export default SshConnect;
