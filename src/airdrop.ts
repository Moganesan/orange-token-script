import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import dotenv from "dotenv";

dotenv.config();
(async () => {
  const connection = new Connection(
    "https://solana-devnet.g.alchemy.com/v2/UnmN7Go5D0TAlW1OWdINFP86drd0LoA7",
    "confirmed"
  );

  const PAYER_KEY: string | undefined = process.env.PAYER_KEY;
  const MINT_AUTHORITY_KEY = process.env.MINT_AUTHORITY_KEY;
  const MINT_KEY = process.env.MINT_KEY;
  const TRANSFER_FEE_CONFIG_AUTHORITY_KEY =
    process.env.TRANSFER_FEE_CONFIG_AUTHORITY_KEY;
  const WITHDRAW_WITHHELD_AUTHORITY_KEY =
    process.env.WITHDRAW_WITHHELD_AUTHORITY_KEY;

  if (
    !PAYER_KEY ||
    !MINT_AUTHORITY_KEY ||
    !MINT_KEY ||
    !TRANSFER_FEE_CONFIG_AUTHORITY_KEY ||
    !WITHDRAW_WITHHELD_AUTHORITY_KEY
  ) {
    console.log("Keys Not Found");
    return;
  }

  const payer = Keypair.fromSecretKey(
    new Uint8Array(Buffer.from(PAYER_KEY.toString(), "hex"))
  );

  const mintAuthority = Keypair.fromSecretKey(
    new Uint8Array(Buffer.from(MINT_AUTHORITY_KEY.toString(), "hex"))
  );

  const mint = Keypair.fromSecretKey(
    new Uint8Array(Buffer.from(MINT_KEY.toString(), "hex"))
  );

  const transferFeeConfigAuthority = Keypair.fromSecretKey(
    new Uint8Array(
      Buffer.from(TRANSFER_FEE_CONFIG_AUTHORITY_KEY.toString(), "hex")
    )
  );

  const withdrawWithHeldAuthority = Keypair.fromSecretKey(
    new Uint8Array(
      Buffer.from(WITHDRAW_WITHHELD_AUTHORITY_KEY.toString(), "hex")
    )
  );

  const payerAirdrop = await connection.requestAirdrop(
    payer.publicKey,
    2 * LAMPORTS_PER_SOL
  );

  const mintAuthorityAirdrop = await connection.requestAirdrop(
    mintAuthority.publicKey,
    2 * LAMPORTS_PER_SOL
  );

  const mintAirdrop = await connection.requestAirdrop(
    mint.publicKey,
    2 * LAMPORTS_PER_SOL
  );

  const transferFeeConfigAuthorityAirdrop = await connection.requestAirdrop(
    transferFeeConfigAuthority.publicKey,
    2 * LAMPORTS_PER_SOL
  );

  const withdrawWithHeldAuthorityAirdrop = await connection.requestAirdrop(
    withdrawWithHeldAuthority.publicKey,
    2 * LAMPORTS_PER_SOL
  );

  await connection.confirmTransaction({
    signature: payerAirdrop,
    ...(await connection.getLatestBlockhash()),
  });

  await connection.confirmTransaction({
    signature: mintAuthorityAirdrop,
    ...(await connection.getLatestBlockhash()),
  });

  await connection.confirmTransaction({
    signature: mintAirdrop,
    ...(await connection.getLatestBlockhash()),
  });

  await connection.confirmTransaction({
    signature: transferFeeConfigAuthorityAirdrop,
    ...(await connection.getLatestBlockhash()),
  });

  await connection.confirmTransaction({
    signature: withdrawWithHeldAuthorityAirdrop,
    ...(await connection.getLatestBlockhash()),
  });

  console.log(
    "Payer Balance: ",
    (await connection.getBalance(payer.publicKey)) / 10 ** 9
  );

  console.log(
    "Mint Authority Balance: ",
    (await connection.getBalance(mintAuthority.publicKey)) / 10 ** 9
  );

  console.log(
    "Mint Balance: ",
    (await connection.getBalance(mint.publicKey)) / 10 ** 9
  );

  console.log(
    "Transfer Fee Authority Balance: ",
    (await connection.getBalance(transferFeeConfigAuthority.publicKey)) /
      10 ** 9
  );

  console.log(
    "Withdraw With Held Authority Balance: ",
    (await connection.getBalance(withdrawWithHeldAuthority.publicKey)) / 10 ** 9
  );
})();
