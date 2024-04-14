import { Keypair } from "@solana/web3.js";

(async () => {
  const payer = Keypair.generate();

  const mintAuthority = Keypair.generate();

  const mintKeyPair = Keypair.generate();

  const transferFeeConfigAuthority = Keypair.generate();

  const withdrawWithHeldAuthority = Keypair.generate();

  console.log(
    "Payer : ",
    Buffer.from(new Uint8Array(payer.secretKey)).toString("hex")
  );
  console.log(
    "Mint Authority :",
    Buffer.from(new Uint8Array(mintAuthority.secretKey)).toString("hex")
  );
  console.log(
    "Mint :",
    Buffer.from(new Uint8Array(mintKeyPair.secretKey)).toString("hex")
  );
  console.log(
    "Transfer Fee Config Authoriry :",
    Buffer.from(new Uint8Array(transferFeeConfigAuthority.secretKey)).toString(
      "hex"
    )
  );
  console.log(
    "Withdraw With Held Authority :",
    Buffer.from(new Uint8Array(withdrawWithHeldAuthority.secretKey)).toString(
      "hex"
    )
  );
})();
