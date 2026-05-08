export type MockUser = {
  name: string;
  title: string;
  gmc: string;
  verified: boolean;
  avatarUrl: string;
};

export const MOCK_USER: MockUser = {
  name: "Dr Sarah Williams",
  title: "Dr",
  gmc: "GMC 6123456",
  verified: true,
  avatarUrl:
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=facearea&facepad=2&w=160&h=160&q=80",
};
