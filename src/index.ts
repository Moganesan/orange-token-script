import {
  clusterApiUrl,
  sendAndConfirmTransaction,
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

import {
  ExtensionType,
  createInitializeMintInstruction,
  mintTo,
  createAccount,
  getMintLen,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import dotenv from "dotenv";

import {
  createInitializeTransferFeeConfigInstruction,
  harvestWithheldTokensToMint,
  transferCheckedWithFee,
  withdrawWithheldTokensFromAccounts,
  withdrawWithheldTokensFromMint,
} from "@solana/spl-token";

dotenv.config();

(async () => {
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

  const withdrawWithheldAuthority = Keypair.fromSecretKey(
    new Uint8Array(
      Buffer.from(WITHDRAW_WITHHELD_AUTHORITY_KEY.toString(), "hex")
    )
  );

  const extensions = [ExtensionType.TransferFeeConfig];

  const mintLen = getMintLen(extensions);
  const decimals = 9;
  const feeBasisPoints = 50;
  const maxFee = BigInt(5_000);

  const connection = new Connection(
    "https://solana-devnet.g.alchemy.com/v2/UnmN7Go5D0TAlW1OWdINFP86drd0LoA7",
    "confirmed"
  );

  // const airdropSignature = await connection.requestAirdrop(
  //   payer.publicKey,
  //   2 * LAMPORTS_PER_SOL
  // );
  // await connection.confirmTransaction({
  //   signature: airdropSignature,
  //   ...(await connection.getLatestBlockhash()),
  // });

  const mintLamports = await connection.getMinimumBalanceForRentExemption(
    mintLen
  );
  const mintTransaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mint.publicKey,
      space: mintLen,
      lamports: mintLamports,
      programId: TOKEN_2022_PROGRAM_ID,
    }),
    createInitializeTransferFeeConfigInstruction(
      mint.publicKey,
      transferFeeConfigAuthority.publicKey,
      withdrawWithheldAuthority.publicKey,
      feeBasisPoints,
      maxFee,
      TOKEN_2022_PROGRAM_ID
    ),
    createInitializeMintInstruction(
      mint.publicKey,
      decimals,
      mintAuthority.publicKey,
      null,
      TOKEN_2022_PROGRAM_ID
    )
  );
  const tx = await sendAndConfirmTransaction(
    connection,
    mintTransaction,
    [payer, mint],
    undefined
  );

  console.log(tx);
})();
