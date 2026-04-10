import restaurantLogo from "./restaurantLogo.png";
import googlePlay from "./googlePlay.svg";
import appStore from "./appStore.svg";
import profile from "./profile.png";

export const assets = {
  restaurantLogo,
  googlePlay,
  appStore,
  profile,
};

export const categories = [
  {
    _id: "c1",
    name: "Món Cà Ri",
    slug: "mon-ca-ri",
  },
  {
    _id: "c2",
    name: "Bánh Naan & Roti",
    slug: "banh-naan-roti",
  },
  {
    _id: "c3",
    name: "Đồ uống",
    slug: "do-uong",
  },
  {
    _id: "c4",
    name: "Tráng miệng",
    slug: "trang-mieng",
  },
];

export const FeaturedFoods = [
  {
    _id: "ff1",
    name: "Butter Chicken",
    description:
      "Những miếng gà mọng nước được ướp qua đêm với sữa chua và gia vị tandoori, sau đó hầm chậm trong sốt cà chua tươi kết hợp bơ lạt và kem tươi. Vị béo ngậy hòa quyện cùng hương thơm của garam masala, quế và bạch đậu khấu tạo nên một món cà ri cổ điển không thể cưỡng lại.",
    image:
      "https://res.cloudinary.com/dee2rmdua/image/upload/v1775103504/tlpukqwx095cjpitmdgo.jpg",
    price: 90000,
  },

  {
    _id: "ff2",
    name: "Paratha",
    description:
      "Bánh mì dẹt làm từ bột mì nguyên cám được gấp và cán nhiều lần tạo thành hàng chục lớp mỏng, sau đó chiên trên chảo gang với bơ ghee cho đến khi từng lớp tách ra giòn rụm. Ăn kèm dưa cải muối chua nhẹ và chutney bạc hà mát lạnh — bữa sáng kinh điển của người Ấn Độ.",
    image:
      "https://res.cloudinary.com/dee2rmdua/image/upload/v1775552838/i86wqrwkkaas4ujkcy7s.jpg",
    price: 60000,
  },

  {
    _id: "ff3",
    name: "Chicken Tikka Masala",
    description:
      "Gà được xiên que và nướng trong lò tandoor truyền thống ở nhiệt độ cao, tạo lớp ngoài xém cạnh với hương khói đặc trưng. Sau đó được đun cùng sốt masala đỏ sánh gồm cà chua, hành tây caramel, ớt và hơn 15 loại gia vị. Mỗi miếng gà mang cả hương vị nướng than lẫn vị cà ri đậm đà — biểu tượng của ẩm thực Ấn Độ.",
    image:
      "https://res.cloudinary.com/dee2rmdua/image/upload/v1775554022/xouju0hnbsjekmsf8aqq.jpg",
    price: 100000,
  },

  {
    _id: "ff4",
    name: "Masala Chai",
    description:
      "Trà đen Assam mạnh được đun sôi trực tiếp cùng sữa tươi nguyên kem, sau đó hãm với 6 loại gia vị: quế Ceylon, đinh hương, gừng tươi giã dập, hạt tiêu đen, hồi và bạch đậu khấu xanh. Vị trà đậm đà hòa với sữa béo và gia vị ấm nóng — tách chai này đủ sức xua tan mọi mệt mỏi.",
    image:
      "https://res.cloudinary.com/dee2rmdua/image/upload/v1775104255/svlgcdypyjja9iybf1ru.jpg",
    price: 45000,
  },
];

export const foods = [
  // Món Cà Ri
  {
    _id: "f1",
    name: "Butter Chicken",
    description:
      "Những miếng gà mọng nước được ướp qua đêm với sữa chua và gia vị tandoori, sau đó hầm chậm trong sốt cà chua tươi kết hợp bơ lạt và kem tươi. Vị béo ngậy hòa quyện cùng hương thơm của garam masala, quế và bạch đậu khấu tạo nên một món cà ri cổ điển không thể cưỡng lại.",
    price: 85000,
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600",
    category: "c1",
    isAvailable: true,
  },
  {
    _id: "f2",
    name: "Lamb Rogan Josh",
    description:
      "Thịt cừu non được chọn lọc kỹ càng, hầm hơn 2 tiếng trong sốt ớt Kashmiri đặc trưng cho màu đỏ rực tự nhiên. Sự kết hợp của hồi, đinh hương, thảo quả và gừng tươi tạo nên lớp hương vị nồng ấm, sâu đằm. Thịt mềm tan trong miệng, thấm đẫm gia vị — một kiệt tác ẩm thực vùng Kashmir.",
    price: 110000,
    image: "https://images.unsplash.com/photo-1545247181-516773cae754?w=600",
    category: "c1",
    isAvailable: true,
  },
  {
    _id: "f3",
    name: "Palak Paneer",
    description:
      "Phô mai tươi tự làm (paneer) cắt khối vuông vức, áp chảo vàng nhẹ rồi hầm trong sốt rau bina xay mịn cùng tỏi, gừng và kem tươi. Màu xanh ngọc bắt mắt, vị thanh tao nhưng đậm đà — món chay giàu protein và sắt, lý tưởng cho người muốn ăn lành mạnh mà không kém phần ngon miệng.",
    price: 75000,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600",
    category: "c1",
    isAvailable: true,
  },
  {
    _id: "f4",
    name: "Chicken Tikka Masala",
    description:
      "Gà được xiên que và nướng trong lò tandoor truyền thống ở nhiệt độ cao, tạo lớp ngoài xém cạnh với hương khói đặc trưng. Sau đó được đun cùng sốt masala đỏ sánh gồm cà chua, hành tây caramel, ớt và hơn 15 loại gia vị. Mỗi miếng gà mang cả hương vị nướng than lẫn vị cà ri đậm đà — biểu tượng của ẩm thực Ấn Độ.",
    price: 90000,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600",
    category: "c1",
    isAvailable: true,
  },

  // Bánh Naan & Roti
  {
    _id: "f5",
    name: "Garlic Naan",
    description:
      "Bột mì nhào kỹ với sữa chua và men nở, ủ đủ giờ để tạo độ xốp tự nhiên rồi dán thẳng vào thành lò đấtnung nóng. Khi vừa ra lò, bánh được phủ ngay một lớp bơ lạt tan chảy và tỏi băm phi vàng thơm lừng. Vỏ ngoài phồng nhẹ lốm đốm cháy, bên trong mềm dai — ăn kèm bất kỳ món cà ri nào cũng tuyệt.",
    price: 35000,
    image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=600",
    category: "c2",
    isAvailable: true,
  },
  {
    _id: "f6",
    name: "Cheese Naan",
    description:
      "Phiên bản nâng cấp của bánh naan truyền thống với nhân phô mai mozzarella và phô mai tươi trộn lẫn, được bọc kín bên trong lớp bột mềm rồi nướng lò đất. Khi cắt đôi, phô mai chảy ra kéo sợi hấp dẫn. Vỏ ngoài giòn vàng, nhân béo ngậy — món bánh được trẻ em và người lớn đều mê.",
    price: 45000,
    image: "https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?w=600",
    category: "c2",
    isAvailable: true,
  },
  {
    _id: "f7",
    name: "Paratha",
    description:
      "Bánh mì dẹt làm từ bột mì nguyên cám được gấp và cán nhiều lần tạo thành hàng chục lớp mỏng, sau đó chiên trên chảo gang với bơ ghee cho đến khi từng lớp tách ra giòn rụm. Ăn kèm dưa cải muối chua nhẹ và chutney bạc hà mát lạnh — bữa sáng kinh điển của người Ấn Độ.",
    price: 30000,
    image: "https://images.unsplash.com/photo-1628294895950-9805252327bc?w=600",
    category: "c2",
    isAvailable: true,
  },

  // Đồ uống
  {
    _id: "f8",
    name: "Masala Chai",
    description:
      "Trà đen Assam mạnh được đun sôi trực tiếp cùng sữa tươi nguyên kem, sau đó hãm với 6 loại gia vị: quế Ceylon, đinh hương, gừng tươi giã dập, hạt tiêu đen, hồi và bạch đậu khấu xanh. Vị trà đậm đà hòa với sữa béo và gia vị ấm nóng — tách chai này đủ sức xua tan mọi mệt mỏi.",
    price: 45000,
    image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600",
    category: "c3",
    isAvailable: true,
  },
  {
    _id: "f9",
    name: "Mango Lassi",
    description:
      "Xoài Alphonso chín mọng — giống xoài quý từ Maharashtra được mệnh danh là 'vua xoài' — xay nhuyễn cùng sữa chua Hy Lạp nguyên chất, sữa tươi lạnh và một chút đường thốt nốt. Kết cấu sánh mịn như kem, vị chua ngọt cân bằng hoàn hảo, mùi xoài thơm ngào ngạt — thức uống giải nhiệt số một mùa hè.",
    price: 55000,
    image: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=600",
    category: "c3",
    isAvailable: true,
  },
  {
    _id: "f10",
    name: "Rose Sharbat",
    description:
      "Nước cánh hoa hồng Damask chưng cất pha cùng siro đường mía, hạt é ngâm nở trắng ngần và sữa tươi lạnh. Màu hồng phấn pastel bắt mắt, hương hoa hồng dịu nhẹ lan tỏa mỗi ngụm uống. Đây là thức uống giải nhiệt và thanh lọc cơ thể được yêu thích khắp tiểu lục địa Ấn Độ từ hàng trăm năm qua.",
    price: 40000,
    image: "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=600",
    category: "c3",
    isAvailable: true,
  },

  // Tráng miệng
  {
    _id: "f11",
    name: "Gulab Jamun",
    description:
      "Những viên bánh làm từ sữa khô (khoya) nhào mịn, chiên ngập dầu đến khi vàng nâu đều đẹp rồi ngâm vào siro đường ấm nóng có pha nước hoa hồng và nghệ tây. Bánh thấm đẫm siro ngọt lịm, mềm xốp đến tận lõi, ăn nóng kèm một muỗng kem vani — trải nghiệm tráng miệng khó quên.",
    price: 40000,
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600",
    category: "c4",
    isAvailable: true,
  },
  {
    _id: "f12",
    name: "Kheer",
    description:
      "Gạo basmati ninh nhỏ lửa trong sữa tươi nguyên kem suốt hơn một tiếng đồng hồ cho đến khi sữa cô đặc sánh lại và gạo nở mềm tan. Thêm vào đó là hạt điều rang vàng, nho khô Ấn Độ, bạch đậu khấu xay và một nhúm nghệ tây quý hiếm. Thưởng thức lạnh hay ấm đều ngon — món chè truyền thống có mặt trong mọi lễ hội Ấn Độ.",
    price: 35000,
    image: "https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=600",
    category: "c4",
    isAvailable: true,
  },
  {
    _id: "f13",
    name: "Kulfi",
    description:
      "Khác với kem công nghiệp, kulfi được làm bằng cách đun sôi sữa liên tục cho đến khi cô đặc còn một phần ba, tạo nên kết cấu đặc chắc và đậm vị sữa tự nhiên. Hương xoài Kesar tươi và pistachios Iran rang giã thô hòa quyện tạo nên chiếc kem que thuần Ấn đóng băng chậm — tan từ từ trong miệng, ngọt mát và thơm lừng.",
    price: 45000,
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600",
    category: "c4",
    isAvailable: true,
  },
];

export const dummyReviews = [
  {
    id: 1,
    name: "Linh Nguyễn",
    avatar: "https://i.pravatar.cc/48?img=47",
    time: "2 ngày trước",
    rating: 5,
    comment:
      "Vị cà ri rất chuẩn Ấn Độ, gà mềm tan trong miệng. Lần nào đến cũng phải gọi món này!",
  },
  {
    id: 2,
    name: "Minh Trần",
    avatar: "https://i.pravatar.cc/48?img=12",
    time: "1 tuần trước",
    rating: 4,
    comment:
      "Nước sốt đậm đà, rất vừa miệng khi ăn kèm với bánh Naan tôi. Phục vụ tại cơ sở Q1 rất tốt.",
  },
  {
    id: 3,
    name: "Thu Hương",
    avatar: "https://i.pravatar.cc/48?img=32",
    time: "2 tuần trước",
    rating: 5,
    comment: "Món ăn tuyệt vời, hương vị rất đặc trưng. Sẽ quay lại lần sau!",
  },
];

export const restaurantsData = [
  {
    _id: "r1",
    name: "Nhà hàng DoMasala Cơ sở 1",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    phone: "0901234567",
    image: "...",
    openTime: "08:00",
    closeTime: "22:00",
  },
  {
    _id: "r2",
    name: "Nhà hàng DoMasala Cơ sở 2",
    address: "456 Lê Văn Lương, Quận 7, TP.HCM",
    phone: "0907654321",
    image: "...",
    openTime: "08:00",
    closeTime: "22:00",
  },
  {
    _id: "r3",
    name: "Nhà hàng DoMasala Cơ sở 3",
    address: "789 Võ Văn Ngân, TP. Thủ Đức, TP.HCM",
    phone: "0909876543",
    image: "...",
    openTime: "09:00",
    closeTime: "21:00",
  },
];
