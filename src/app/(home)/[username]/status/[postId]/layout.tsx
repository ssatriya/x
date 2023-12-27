import Header from "@/components/main/header";

const PostLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header title="Post" backButton={true} />
      {children}
    </>
  );
};
export default PostLayout;
