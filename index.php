<?php
include("db.php");

$category = "";

if(isset($_GET['category'])){
    $category = $_GET['category'];

    $sql = "SELECT * FROM products
            WHERE category='$category'";
}else{
    $sql = "SELECT * FROM products";
}

$result = mysqli_query($conn, $sql);
?>

<!DOCTYPE html>
<html>
<head>
    <title>SmartOrnaments</title>

<style>

body{
    font-family: Arial;
    background:#f5f5f5;
    margin:0;
    padding:20px;
}

h1{
    text-align:center;
}

.filter{
    text-align:center;
    margin-bottom:30px;
}

.filter a{
    text-decoration:none;
    background:black;
    color:white;
    padding:10px 20px;
    margin:5px;
    border-radius:8px;
}

.products{
    display:flex;
    flex-wrap:wrap;
    justify-content:center;
    gap:20px;
}

.card{
    background:white;
    width:280px;
    border-radius:15px;
    overflow:hidden;
    box-shadow:0 5px 15px rgba(0,0,0,0.1);
    transition:0.3s;
}

.card:hover{
    transform:translateY(-5px);
}

.card img{
    width:100%;
    height:250px;
    object-fit:cover;
}

.content{
    padding:15px;
}

.price{
    color:#ff4d6d;
    font-size:22px;
    font-weight:bold;
}

.btn{
    display:inline-block;
    background:#ff4d6d;
    color:white;
    padding:10px 15px;
    border-radius:8px;
    text-decoration:none;
    margin-top:10px;
}

</style>

</head>
<body>

<h1>SmartOrnaments Shop</h1>

<div class="filter">
    <a href="index.php">All</a>

    <a href="?category=Bracelet">
        Bracelet
    </a>

    <a href="?category=Accessories">
        Accessories
    </a>

    <a href="?category=Resin Keychain">
        Resin Keychain
    </a>
</div>

<div class="products">

<?php
while($row = mysqli_fetch_assoc($result)){
?>

<div class="card">

<img src="uploads/<?php echo $row['image']; ?>">

<div class="content">

<h2>
<?php echo $row['name']; ?>
</h2>

<p class="price">
₹<?php echo $row['price']; ?>
</p>

<p>
<?php echo $row['description']; ?>
</p>

<a class="btn"
href="#">
Order Now
</a>

</div>

</div>

<?php
}
?>

</div>

</body>
</html>
